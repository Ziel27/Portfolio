import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import brevo from "@getbrevo/brevo";

dotenv.config();

const router = express.Router();

// Note: Rate limiting is now handled at the server level in server.js
// The contactLimiter is applied to all /api/contact routes

// Check if Brevo API is configured
const isBrevoConfigured = () => {
  const hasKey = !!process.env.BREVO_API_KEY;
  if (!hasKey) {
    console.log("ℹ️  Brevo API key not found. Using SMTP fallback or logging.");
  }
  return hasKey;
};

// Create Brevo API client
const getBrevoClient = () => {
  if (!isBrevoConfigured()) return null;

  try {
    // Validate API key format (should be a string)
    if (
      typeof process.env.BREVO_API_KEY !== "string" ||
      process.env.BREVO_API_KEY.trim().length === 0
    ) {
      console.error("❌ BREVO_API_KEY is invalid or empty in .env file");
      return null;
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY.trim()
    );

    // Validate sender email is set
    if (!process.env.BREVO_SENDER_EMAIL && !process.env.EMAIL_FROM) {
      console.warn(
        "⚠️  BREVO_SENDER_EMAIL not set. Make sure to verify your sender email in Brevo dashboard."
      );
      console.warn(
        "   Go to: https://app.brevo.com/settings/senders to add and verify your sender email"
      );
    } else {
      console.log(
        `✅ Brevo API configured with sender: ${
          process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM
        }`
      );
    }

    return apiInstance;
  } catch (error) {
    console.error("❌ Error initializing Brevo API client:", error.message);
    return null;
  }
};

// Create transporter for sending emails (SMTP fallback)
const createTransporter = () => {
  // If Brevo SMTP is configured
  if (process.env.BREVO_SMTP_KEY && process.env.BREVO_SMTP_SERVER) {
    return nodemailer.createTransport({
      host: process.env.BREVO_SMTP_SERVER || "smtp-relay.brevo.com",
      port: process.env.BREVO_SMTP_PORT || 587,
      secure: false,
      auth: {
        user:
          process.env.BREVO_SMTP_USER ||
          process.env.BREVO_SMTP_KEY.split(":")[0],
        pass:
          process.env.BREVO_SMTP_KEY.split(":")[1] ||
          process.env.BREVO_SMTP_KEY,
      },
    });
  }

  // If custom email credentials are provided, use them
  if (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Otherwise, use Gmail with app password (for development)
  // Note: For Gmail, you need to use an App Password, not your regular password
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Fallback: Use Ethereal Email for testing (doesn't actually send emails)
  return null;
};

// Validation middleware for contact form
const validateContact = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name is required and must be less than 100 characters")
    .escape(),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters")
    .escape(),
];

// Contact form submission
router.post("/", validateContact, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { name, email, message } = req.body;

    // Email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin: 10px 0;"><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #4F46E5; margin-top: 10px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This message was sent from your portfolio contact form.
        </p>
      </div>
    `;

    // Try Brevo API first (recommended)
    const brevoClient = getBrevoClient();
    let brevoAuthFailed = false; // Track if we got a 401 error

    if (brevoClient) {
      const maxRetries = 3;
      let retries = 0;
      let lastError;

      while (retries < maxRetries) {
        try {
          const sendSmtpEmail = new brevo.SendSmtpEmail();
          sendSmtpEmail.subject = `Portfolio Contact Form: Message from ${name}`;
          sendSmtpEmail.htmlContent = emailHtml;

          const senderEmail =
            process.env.BREVO_SENDER_EMAIL ||
            process.env.EMAIL_FROM ||
            "noreply@portfolio.com";

          sendSmtpEmail.sender = {
            name: "Portfolio Contact Form",
            email: senderEmail,
          };
          sendSmtpEmail.to = [
            { email: "gianpon05@gmail.com", name: "Gian Daziel Pon" },
          ];
          sendSmtpEmail.replyTo = { email: email, name: name };

          await brevoClient.sendTransacEmail(sendSmtpEmail);

          if (process.env.NODE_ENV === "development") {
            console.log(
              `✅ Email sent successfully via Brevo API to gianpon05@gmail.com from ${email}`
            );
          }

          res.json({
            message: "Message sent successfully!",
            success: true,
          });
          return;
        } catch (error) {
          lastError = error;
          retries++;

          // Check for 401 error in various formats (Brevo SDK may return errors differently)
          const statusCode =
            error.response?.statusCode ||
            error.statusCode ||
            error.response?.status ||
            error.status ||
            (error.message?.includes("401") ? 401 : null);

          // Better error logging for 401 (Unauthorized)
          if (
            statusCode === 401 ||
            error.message?.includes("401") ||
            error.message?.includes("Unauthorized")
          ) {
            brevoAuthFailed = true; // Mark that we got a 401

            console.error(
              `\n❌ Brevo API Authentication Failed (401 Unauthorized):`
            );
            console.error(`   📋 Troubleshooting Steps:`);
            console.error(
              `   1. Check if BREVO_API_KEY is correct in .env file`
            );
            console.error(
              `   2. Verify the API key has proper permissions in Brevo dashboard`
            );
            console.error(
              `   3. Ensure sender email (${
                process.env.BREVO_SENDER_EMAIL || "not set"
              }) is verified in Brevo`
            );
            console.error(
              `   4. Go to: https://app.brevo.com/settings/senders to verify your sender email`
            );
            console.error(
              `   5. Go to: https://app.brevo.com/settings/keys/api to check your API key`
            );
            if (error.response?.body || error.body) {
              console.error(
                `   Error details:`,
                error.response?.body || error.body
              );
            } else if (error.message) {
              console.error(`   Error message:`, error.message);
            }

            // Don't retry on 401 - it's an auth issue, not a transient error
            console.warn(
              `\n⚠️  Brevo API authentication failed, falling back to SMTP\n`
            );
            break;
          }

          console.warn(
            `⚠️ Brevo API send attempt ${retries}/${maxRetries} failed:`,
            error.message ||
              error.body?.message ||
              error.response?.body?.message ||
              "Unknown error"
          );

          if (retries < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
          }
        }
      }

      // Only show this message if it wasn't a 401 auth error
      if (!brevoAuthFailed && lastError) {
        console.warn("⚠️ Brevo API failed after retries, falling back to SMTP");
      }
    }

    // Fallback to SMTP (Brevo SMTP or other providers)
    const transporter = createTransporter();

    if (!transporter) {
      // If no email configuration, log the message and return success
      if (process.env.NODE_ENV === "development") {
        console.log("=== CONTACT FORM SUBMISSION ===");
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Message:", message);
        console.log("==============================");
      }

      return res.json({
        message: "Message received! (Email not configured - check server logs)",
        success: true,
      });
    }

    // Email content for SMTP
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        process.env.BREVO_SENDER_EMAIL ||
        process.env.GMAIL_USER ||
        "noreply@portfolio.com",
      to: "gianpon05@gmail.com",
      subject: `Portfolio Contact Form: Message from ${name}`,
      html: emailHtml,
      replyTo: email,
    };

    // Send email with retry logic (production best practice)
    const maxRetries = 3;
    let retries = 0;
    let lastError;

    while (retries < maxRetries) {
      try {
        await transporter.sendMail(mailOptions);

        // Log successful send (in production, use proper logging service)
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ Email sent successfully via SMTP to gianpon05@gmail.com from ${email}`
          );
        }

        res.json({
          message: "Message sent successfully!",
          success: true,
        });
        return;
      } catch (error) {
        lastError = error;
        retries++;

        // Log retry attempt
        console.warn(
          `⚠️ SMTP email send attempt ${retries}/${maxRetries} failed:`,
          error.message
        );

        // Wait before retry (exponential backoff)
        if (retries < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
        }
      }
    }

    // All retries failed
    console.error("❌ Email send failed after retries:", {
      to: mailOptions.to,
      from: email,
      error: lastError.message,
    });

    res.status(500).json({
      error: "Failed to send message. Please try again later.",
      details:
        process.env.NODE_ENV === "development" ? lastError.message : undefined,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      error: "Failed to send message. Please try again later.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;

# Production Email Setup Guide

## ⚠️ Important: Gmail is NOT Recommended for Production

While Gmail works for development, it has limitations for production:

- **Rate Limits**: Gmail has strict sending limits (500 emails/day for free accounts)
- **Reliability**: Not designed for transactional emails
- **Deliverability**: Higher chance of emails going to spam
- **Security**: Using personal Gmail credentials in production is a security risk

## ✅ Recommended Production Email Services

### 1. **Brevo** (Formerly Sendinblue) ⭐ RECOMMENDED

- **Free Tier**: 300 emails/day forever
- **Paid**: Starts at $25/month for 20,000 emails
- **Pros**:
  - Generous free tier (300/day = 9,000/month)
  - Easy API integration
  - Great documentation
  - Good deliverability
  - Both REST API and SMTP support
- **Setup**:
  1. Sign up at https://www.brevo.com (free account)
  2. Go to Settings → API Keys → Create API Key
  3. Copy your API key
  4. Add to `.env`: `BREVO_API_KEY=your-key-here`
  5. Verify sender email in Brevo dashboard

### 2. **SendGrid** (Easy Setup)

- **Free Tier**: 100 emails/day forever
- **Paid**: Starts at $15/month for 40,000 emails
- **Pros**: Easy API, great documentation, good deliverability
- **Setup**:
  1. Sign up at https://sendgrid.com
  2. Create API key
  3. Verify sender email
  4. Use SMTP or API

### 3. **Mailgun** (Great for Developers)

- **Free Tier**: 5,000 emails/month for 3 months, then 1,000/month
- **Paid**: Starts at $35/month
- **Pros**: Developer-friendly, excellent API, good analytics
- **Setup**: Similar to SendGrid

### 4. **AWS SES** (Cost-Effective)

- **Free Tier**: 62,000 emails/month (if on EC2)
- **Paid**: $0.10 per 1,000 emails
- **Pros**: Very cheap, highly scalable, reliable
- **Cons**: Requires AWS account setup, more complex

### 5. **Resend** (Modern & Simple)

- **Free Tier**: 3,000 emails/month
- **Paid**: Starts at $20/month
- **Pros**: Modern API, great developer experience
- **Setup**: Very simple

## 🔧 Production Configuration

### Option 1: Brevo API (Recommended) ⭐

1. **Sign up and get API key**:

   - Go to https://www.brevo.com
   - Sign up for free account
   - Settings → API Keys → Create API Key
   - Copy the API key

2. **Verify sender email**:

   - Go to Senders → Add a sender
   - Verify your email address
   - This will be used as the "from" address

3. **Update your `.env` file**:

```env
BREVO_API_KEY=your-brevo-api-key-here
BREVO_SENDER_EMAIL=noreply@yourdomain.com
```

4. **That's it!** The code will automatically use Brevo API.

**Alternative: Brevo SMTP** (if you prefer SMTP):

```env
BREVO_SMTP_KEY=your-smtp-key
BREVO_SMTP_SERVER=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-smtp-username
```

### Option 2: SendGrid

1. **Sign up and get API key**:

   - Go to https://sendgrid.com
   - Settings → API Keys → Create API Key
   - Copy the API key

2. **Update your `.env` file**:

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key-here
EMAIL_FROM=noreply@yourdomain.com
```

3. **Verify your domain** (for better deliverability):
   - Add SPF, DKIM records to your DNS
   - Follow SendGrid's domain verification guide

### Option 3: Mailgun

1. **Sign up and get credentials**:

   - Go to https://mailgun.com
   - Get SMTP credentials from Settings → Sending → SMTP

2. **Update your `.env` file**:

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
EMAIL_FROM=noreply@yourdomain.com
```

### Option 4: AWS SES

1. **Set up AWS SES**:

   - Create AWS account
   - Verify your email/domain
   - Get SMTP credentials

2. **Update your `.env` file**:

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASS=your-ses-smtp-password
EMAIL_FROM=noreply@yourdomain.com
```

## 🔒 Security Best Practices

### 1. **Never Commit Secrets**

- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables
- ✅ Use secret management services (AWS Secrets Manager, etc.)

### 2. **Use Environment-Specific Configs**

```env
# Development
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
GMAIL_USER=dev@example.com
GMAIL_APP_PASSWORD=dev-password

# Production
NODE_ENV=production
EMAIL_HOST=smtp.sendgrid.net
EMAIL_USER=apikey
EMAIL_PASS=production-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### 3. **Rate Limiting** (Add to contact route)

```javascript
import rateLimit from "express-rate-limit";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many contact requests, please try again later.",
});

router.post("/", contactLimiter, async (req, res) => {
  // ... existing code
});
```

### 4. **Input Sanitization**

- Already implemented: email validation
- Consider adding: message length limits, HTML sanitization

## 📊 Monitoring & Logging

### 1. **Add Email Logging**

```javascript
// Log successful sends
console.log(`Email sent to ${mailOptions.to} from ${email}`);

// Log failures
catch (error) {
  console.error('Email send failed:', {
    to: mailOptions.to,
    from: email,
    error: error.message
  });
  // Consider using a logging service (Winston, Pino, etc.)
}
```

### 2. **Email Delivery Tracking**

- Most email services provide webhooks for delivery status
- Track: sent, delivered, opened, clicked, bounced, spam

## 🚀 Additional Production Improvements

### 1. **Add Queue System** (For High Volume)

```javascript
// Use Bull or similar for email queues
import Queue from "bull";

const emailQueue = new Queue("email", {
  redis: { host: "localhost", port: 6379 },
});

// Add to queue instead of sending directly
emailQueue.add("contact", { name, email, message });
```

### 2. **Email Templates**

- Use a templating engine (Handlebars, EJS)
- Store templates separately
- Support multiple languages

### 3. **Retry Logic**

```javascript
const maxRetries = 3;
let retries = 0;

while (retries < maxRetries) {
  try {
    await transporter.sendMail(mailOptions);
    break;
  } catch (error) {
    retries++;
    if (retries >= maxRetries) throw error;
    await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
  }
}
```

## 📝 Quick Start: SendGrid Setup

1. **Install SendGrid** (if using their Node.js SDK):

```bash
npm install @sendgrid/mail
```

2. **Update contact route** (optional - can still use SMTP):

```javascript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "gianpon05@gmail.com",
  from: "noreply@yourdomain.com",
  subject: `Portfolio Contact: ${name}`,
  html: emailTemplate,
};

await sgMail.send(msg);
```

## ✅ Production Checklist

- [ ] Use professional email service (SendGrid, Mailgun, etc.)
- [ ] Verify sender domain/email
- [ ] Set up SPF/DKIM records
- [ ] Add rate limiting
- [ ] Implement proper error handling
- [ ] Set up monitoring/logging
- [ ] Use environment variables for secrets
- [ ] Test email delivery
- [ ] Set up email templates
- [ ] Consider queue system for high volume

## 🔗 Resources

- **SendGrid**: https://sendgrid.com/docs/
- **Mailgun**: https://documentation.mailgun.com/
- **AWS SES**: https://docs.aws.amazon.com/ses/
- **Resend**: https://resend.com/docs

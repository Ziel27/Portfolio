import { useState } from "react";
import {
  FiMail,
  FiMapPin,
  FiSend,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiFacebook,
  FiMessageCircle,
} from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactAPI } from "@/services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await contactAPI.sendMessage(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              Get In Touch
            </h1>
            <p className="text-muted-foreground">
              Have a project in mind? I'm available for freelance work. Let's
              create something amazing together.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Info Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiMail className="h-5 w-5" />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <FiMail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Email</h4>
                      <a
                        href="mailto:gianpon05@gmail.com"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        gianpon05@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <FiMapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Location</h4>
                      <p className="text-sm text-muted-foreground">
                        Available for remote work
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <FiMessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        Response Time
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Usually within 24 hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiGithub className="h-5 w-5" />
                    Connect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a
                      href="https://github.com/Ziel27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <FiGithub className="h-4 w-4" />
                      <span>GitHub - @Ziel27</span>
                    </a>
                    <a
                      href="https://linkedin.com/in/gian-daziel-pon-982b37296"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <FiLinkedin className="h-4 w-4" />
                      <span>LinkedIn - Connect</span>
                    </a>
                    <a
                      href="https://instagram.com/giii_daa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <FiInstagram className="h-4 w-4" />
                      <span>Instagram - @giii_daa</span>
                    </a>
                    <a
                      href="https://facebook.com/gianpon27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <FiFacebook className="h-4 w-4" />
                      <span>Facebook - Connect</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiMail className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a
                      href="mailto:gianpon05@gmail.com"
                      className="flex items-center gap-2"
                    >
                      <FiMail className="h-4 w-4" />
                      <span>Send Email</span>
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and I'll get back to you as soon as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                        <FiSend className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. I'll get back to you soon!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                          {error}
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="h-12"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="h-12"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium mb-2"
                        >
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Your message..."
                          rows={6}
                          className="resize-none"
                          disabled={loading}
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full group"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FiSend className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

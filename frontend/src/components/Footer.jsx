import { Link } from "react-router-dom";
import {
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiFacebook,
  FiMail,
  FiHeart,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">
                Gian Daziel <span className="text-primary">Pon</span>
              </h3>
              <p className="text-muted-foreground">
                Full Stack Developer & Freelancer crafting digital experiences
                through code.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FiHeart className="h-4 w-4 text-red-500" />
                <span>Available for freelance opportunities</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Me</h4>
              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/Ziel27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FiGithub className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/gian-daziel-pon-982b37296"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FiLinkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://instagram.com/giii_daa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FiInstagram className="h-5 w-5" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://facebook.com/gianpon27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FiFacebook className="h-5 w-5" />
                  <span>Facebook</span>
                </a>
                <a
                  href="mailto:gianpon05@gmail.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FiMail className="h-5 w-5" />
                  <span>gianpon05@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-8 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                © {currentYear} Gian Daziel Pon. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground text-center sm:text-right">
                Built with React, Node.js & MongoDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

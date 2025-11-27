import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFolder,
  FiUser,
  FiMail,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const navItems = [
    { path: "/", label: "Home", icon: FiHome },
    { path: "/projects", label: "Projects", icon: FiFolder },
    { path: "/about", label: "About", icon: FiUser },
    { path: "/contact", label: "Contact", icon: FiMail },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - takes less space on tablet */}
          <Link
            to="/"
            className="flex items-center space-x-2 flex-shrink-0 z-10"
          >
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gian Daziel Pon
            </span>
          </Link>

          {/* Desktop/Tablet Navigation - centered */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0 z-10">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="hidden lg:flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-2 md:px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-md text-xs ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

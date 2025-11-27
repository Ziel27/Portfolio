import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  SeasonalThemeProvider,
  useSeasonalTheme,
} from "./contexts/SeasonalThemeContext";
import SeasonalEffects from "./components/SeasonalEffects";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Wrapper component to use seasonal theme context
const SeasonalThemeWrapper = ({ children }) => {
  const { activeSeason, loading } = useSeasonalTheme();

  // Don't render effects while loading to avoid flicker
  if (loading) {
    return <>{children}</>;
  }

  return (
    <>
      <SeasonalEffects season={activeSeason} />
      {children}
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <SeasonalThemeProvider>
        <Router>
          <SeasonalThemeWrapper>
            <div
              className="min-h-screen bg-background flex flex-col relative"
              style={{ position: "relative" }}
            >
              <Navbar
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
              <main
                className="flex-1 relative"
                style={{ zIndex: 10, position: "relative" }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/admin/login"
                    element={
                      isAuthenticated ? (
                        <Navigate to="/admin/dashboard" replace />
                      ) : (
                        <AdminLogin setIsAuthenticated={setIsAuthenticated} />
                      )
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard
                          setIsAuthenticated={setIsAuthenticated}
                        />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SeasonalThemeWrapper>
        </Router>
      </SeasonalThemeProvider>
    </ThemeProvider>
  );
}

export default App;

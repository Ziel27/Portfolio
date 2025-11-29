import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentSeason } from "@/utils/seasons";
import { userAPI } from "@/services/api";

const SeasonalThemeContext = createContext();

export const useSeasonalTheme = () => {
  const context = useContext(SeasonalThemeContext);
  if (!context) {
    throw new Error(
      "useSeasonalTheme must be used within SeasonalThemeProvider"
    );
  }
  return context;
};

export const SeasonalThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("auto");
  const [currentSeason, setCurrentSeason] = useState(getCurrentSeason());
  const [loading, setLoading] = useState(true);

  // Determine the active season based on theme mode
  // Return null if disabled to prevent seasonal effects
  const activeSeason =
    themeMode === "disabled"
      ? null
      : themeMode === "auto"
      ? currentSeason
      : themeMode;

  useEffect(() => {
    // Fetch theme preference from server
    const fetchTheme = async () => {
      try {
        const data = await userAPI.getTheme();
        const mode = data.themeMode || "auto";
        setThemeMode(mode);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching theme:", error);
        }
        // Set default to auto if API fails
        setThemeMode("auto");
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();

    // Update current season every hour
    const updateSeason = () => {
      const season = getCurrentSeason();
      setCurrentSeason(season);
    };

    // Initial season update
    updateSeason();
    const interval = setInterval(updateSeason, 3600000); // Every hour

    return () => clearInterval(interval);
  }, []);

  const updateThemeMode = async (newMode) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await userAPI.updateStatus(undefined, newMode);
      }
      setThemeMode(newMode);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error updating theme:", error);
      }
    }
  };

  return (
    <SeasonalThemeContext.Provider
      value={{
        themeMode,
        activeSeason,
        currentSeason,
        updateThemeMode,
        loading,
      }}
    >
      {children}
    </SeasonalThemeContext.Provider>
  );
};

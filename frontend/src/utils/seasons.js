/**
 * Get the current season based on date
 * @returns {string} - 'winter', 'spring', 'summer', or 'fall'
 */
export const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Northern Hemisphere seasons
  // Winter: Dec 21 - Mar 20
  // Spring: Mar 21 - Jun 20
  // Summer: Jun 21 - Sep 20
  // Fall: Sep 21 - Dec 20

  if (month === 12 && day >= 21) return "winter";
  if (month === 1 || month === 2) return "winter";
  if (month === 3 && day < 21) return "winter";

  if (month === 3 && day >= 21) return "spring";
  if (month === 4 || month === 5) return "spring";
  if (month === 6 && day < 21) return "spring";

  if (month === 6 && day >= 21) return "summer";
  if (month === 7 || month === 8) return "summer";
  if (month === 9 && day < 21) return "summer";

  if (month === 9 && day >= 21) return "fall";
  if (month === 10 || month === 11) return "fall";
  if (month === 12 && day < 21) return "fall";

  return "spring"; // Default fallback
};

/**
 * Get season emoji
 */
export const getSeasonEmoji = (season) => {
  const emojis = {
    winter: "❄️",
    spring: "🌸",
    summer: "☀️",
    fall: "🍂",
  };
  return emojis[season] || "🌸";
};

/**
 * Get season name (capitalized)
 */
export const getSeasonName = (season) => {
  return season.charAt(0).toUpperCase() + season.slice(1);
};

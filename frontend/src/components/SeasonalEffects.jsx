import { useEffect, useState } from "react";
import { getCurrentSeason } from "@/utils/seasons";

// Snowflake component for Winter
const Snowflake = ({ left, delay, duration, size }) => {
  return (
    <div
      className="absolute pointer-events-none top-0"
      style={{
        left: `${left}%`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-blue-200 dark:text-blue-300"
        style={{
          animation: `fall ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      >
        <path
          d="M12 2v20M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3M2 12h20M2 12l3-3M2 12l3 3M22 12l-3-3M22 12l-3 3M6.34 6.34l11.32 11.32M6.34 17.66l11.32-11.32M17.66 6.34L6.34 17.66M17.66 17.66L6.34 6.34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// Dry Leaf component for Fall
const Leaf = ({ left, delay, duration, size, rotation }) => {
  return (
    <div
      className="absolute pointer-events-none top-0"
      style={{
        left: `${left}%`,
        animation: `fall ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-amber-800 dark:text-amber-700"
        style={{
          animation: `sway ${duration * 0.8}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transform: `rotate(${rotation}deg)`,
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
        }}
      >
        {/* Main leaf shape - maple/autumn leaf style */}
        <path
          d="M12 2 L10 4 L8 6 L7 8 L6 10 L6 12 L7 14 L8 16 L10 18 L12 20 L14 18 L16 16 L17 14 L18 12 L18 10 L17 8 L16 6 L14 4 Z"
          fill="currentColor"
          opacity="0.95"
        />
        {/* Leaf stem */}
        <line
          x1="12"
          y1="2"
          x2="12"
          y2="6"
          stroke="#8B4513"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Central vein (main stem) */}
        <line
          x1="12"
          y1="6"
          x2="12"
          y2="20"
          stroke="#8B4513"
          strokeWidth="1.5"
          opacity="0.7"
        />
        {/* Left side veins */}
        <line
          x1="12"
          y1="8"
          x2="9"
          y2="10"
          stroke="#8B4513"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1="12"
          y1="10"
          x2="8"
          y2="12"
          stroke="#8B4513"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1="12"
          y1="12"
          x2="9"
          y2="14"
          stroke="#8B4513"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1="12"
          y1="14"
          x2="10"
          y2="16"
          stroke="#8B4513"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Right side veins */}
        <line
          x1="12"
          y1="8"
          x2="15"
          y2="10"
          stroke="#8B4513"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1="12"
          y1="10"
          x2="16"
          y2="12"
          stroke="#8B4513"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1="12"
          y1="12"
          x2="15"
          y2="14"
          stroke="#8B4513"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1="12"
          y1="14"
          x2="14"
          y2="16"
          stroke="#8B4513"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Small texture lines for dry leaf effect */}
        <path
          d="M10 8 L9.5 8.5 M11 10 L10.5 10.5 M13 10 L13.5 10.5 M14 8 L14.5 8.5 M10 12 L9.5 12.5 M14 12 L14.5 12.5"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

// Flower component for Spring
const Petal = ({ left, delay, duration, size }) => {
  return (
    <div
      className="absolute pointer-events-none top-0"
      style={{
        left: `${left}%`,
        animation: `fall ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-pink-500 dark:text-pink-400"
        style={{
          animation: `float ${duration * 0.6}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        }}
      >
        {/* Flower with 5 petals */}
        {/* Top petal */}
        <ellipse
          cx="12"
          cy="8"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Top-left petal */}
        <ellipse
          cx="7"
          cy="10"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.9"
          transform="rotate(-45 7 10)"
        />
        {/* Top-right petal */}
        <ellipse
          cx="17"
          cy="10"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.9"
          transform="rotate(45 17 10)"
        />
        {/* Bottom-left petal */}
        <ellipse
          cx="8"
          cy="15"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.9"
          transform="rotate(-135 8 15)"
        />
        {/* Bottom-right petal */}
        <ellipse
          cx="16"
          cy="15"
          rx="4"
          ry="6"
          fill="currentColor"
          opacity="0.9"
          transform="rotate(135 16 15)"
        />
        {/* Flower center */}
        <circle cx="12" cy="12" r="3" fill="#FFD700" opacity="0.8" />
      </svg>
    </div>
  );
};

// Beach Ball component for Summer
const BeachBall = ({ left, delay, duration, size }) => {
  return (
    <div
      className="absolute pointer-events-none top-0"
      style={{
        left: `${left}%`,
        animation: `fall ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{
          animation: `float ${duration * 0.5}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        }}
      >
        {/* Beach ball with colorful stripes */}
        <circle cx="12" cy="12" r="10" fill="#FF6B6B" />
        {/* Top section - red */}
        <path d="M2 12 A10 10 0 0 1 12 2 L12 12 Z" fill="#FF6B6B" />
        {/* Bottom section - blue */}
        <path d="M22 12 A10 10 0 0 1 12 22 L12 12 Z" fill="#4ECDC4" />
        {/* Left section - yellow */}
        <path d="M12 2 A10 10 0 0 1 2 12 L12 12 Z" fill="#FFE66D" />
        {/* Right section - white */}
        <path d="M12 22 A10 10 0 0 1 22 12 L12 12 Z" fill="#FFFFFF" />
        {/* Vertical stripe */}
        <line x1="12" y1="2" x2="12" y2="22" stroke="#000" strokeWidth="1.5" />
        {/* Horizontal stripe */}
        <line x1="2" y1="12" x2="22" y2="12" stroke="#000" strokeWidth="1.5" />
        {/* Diagonal stripes */}
        <line x1="7" y1="7" x2="17" y2="17" stroke="#000" strokeWidth="1" />
        <line x1="17" y1="7" x2="7" y2="17" stroke="#000" strokeWidth="1" />
        {/* Outer circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

// Palm Leaf component for Summer
const PalmLeaf = ({ left, delay, duration, size, rotation }) => {
  return (
    <div
      className="absolute pointer-events-none top-0"
      style={{
        left: `${left}%`,
        animation: `fall ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-green-600 dark:text-green-500"
        style={{
          animation: `sway ${duration * 0.7}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Palm leaf - long and narrow with segments */}
        {/* Main stem */}
        <line
          x1="12"
          y1="2"
          x2="12"
          y2="20"
          stroke="#2D5016"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left segments */}
        <path
          d="M12 4 L8 6 L6 8 L5 10 L4 12 L5 14 L6 16 L8 18 L12 20"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Right segments */}
        <path
          d="M12 4 L16 6 L18 8 L19 10 L20 12 L19 14 L18 16 L16 18 L12 20"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Additional left segments */}
        <path
          d="M12 8 L9 10 L7 12 L6 14 L7 16 L9 18 L12 20"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M12 12 L10 14 L9 16 L10 18 L12 20"
          fill="currentColor"
          opacity="0.7"
        />
        {/* Additional right segments */}
        <path
          d="M12 8 L15 10 L17 12 L18 14 L17 16 L15 18 L12 20"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M12 12 L14 14 L15 16 L14 18 L12 20"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

// Shell component for Summer
const Shell = ({ left, delay, duration, size, rotation }) => {
  return (
    <div
      className="absolute pointer-events-none top-0"
      style={{
        left: `${left}%`,
        animation: `fall ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-amber-200 dark:text-amber-300"
        style={{
          animation: `sway ${duration * 0.6}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Shell shape */}
        <path
          d="M12 2 C10 4, 8 6, 7 8 C6 10, 6 12, 7 14 C8 16, 10 18, 12 20 C14 18, 16 16, 17 14 C18 12, 18 10, 17 8 C16 6, 14 4, 12 2 Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Shell spiral lines */}
        <path
          d="M12 4 Q10 6 9 8 Q8 10 8 12 Q9 14 10 16 Q11 18 12 20"
          stroke="#D4A574"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M12 6 Q11 8 10 10 Q9 12 9 14 Q10 16 11 18"
          stroke="#D4A574"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

const SeasonalEffects = ({ season }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    if (!season) {
      setElements([]);
      return;
    }

    const generateElements = () => {
      const count =
        season === "winter"
          ? 30
          : season === "fall"
          ? 20
          : season === "spring"
          ? 25
          : season === "summer"
          ? 15
          : 0;
      const newElements = [];

      for (let i = 0; i < count; i++) {
        if (season === "winter") {
          newElements.push({
            id: `${season}-${i}-${Date.now()}-${Math.random()}`,
            type: "snowflake",
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 5,
            size: 8 + Math.random() * 12,
          });
        } else if (season === "fall") {
          newElements.push({
            id: `${season}-${i}-${Date.now()}-${Math.random()}`,
            type: "leaf",
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 6 + Math.random() * 4,
            size: 12 + Math.random() * 16,
            rotation: Math.random() * 360,
          });
        } else if (season === "spring") {
          newElements.push({
            id: `${season}-${i}-${Date.now()}-${Math.random()}`,
            type: "petal",
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 7 + Math.random() * 5,
            size: 10 + Math.random() * 14,
          });
        } else if (season === "summer") {
          const elementType = Math.random();
          if (elementType < 0.4) {
            // 40% beach balls
            newElements.push({
              id: `${season}-ball-${i}-${Date.now()}-${Math.random()}`,
              type: "beachball",
              left: Math.random() * 100,
              delay: Math.random() * 5,
              duration: 8 + Math.random() * 4,
              size: 16 + Math.random() * 12,
            });
          } else if (elementType < 0.7) {
            // 30% palm leaves
            newElements.push({
              id: `${season}-palm-${i}-${Date.now()}-${Math.random()}`,
              type: "palmleaf",
              left: Math.random() * 100,
              delay: Math.random() * 5,
              duration: 7 + Math.random() * 5,
              size: 14 + Math.random() * 18,
              rotation: Math.random() * 360,
            });
          } else {
            // 30% shells
            newElements.push({
              id: `${season}-shell-${i}-${Date.now()}-${Math.random()}`,
              type: "shell",
              left: Math.random() * 100,
              delay: Math.random() * 5,
              duration: 6 + Math.random() * 4,
              size: 10 + Math.random() * 14,
              rotation: Math.random() * 360,
            });
          }
        }
      }

      setElements(newElements);
    };

    // Generate immediately
    generateElements();
    const interval = setInterval(generateElements, 30000); // Regenerate every 30s

    return () => clearInterval(interval);
  }, [season]);

  // Don't render if no season
  if (!season) {
    return null;
  }

  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    pointerEvents: "none",
    overflow: "hidden",
  };

  if (season === "winter") {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={containerStyle}
      >
        {elements.length > 0
          ? elements.map((el) => (
              <Snowflake
                key={el.id}
                left={el.left}
                delay={el.delay}
                duration={el.duration}
                size={el.size}
              />
            ))
          : null}
      </div>
    );
  }

  if (season === "fall") {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={containerStyle}
      >
        {elements.length > 0
          ? elements.map((el) => (
              <Leaf
                key={el.id}
                left={el.left}
                delay={el.delay}
                duration={el.duration}
                size={el.size}
                rotation={el.rotation}
              />
            ))
          : null}
      </div>
    );
  }

  if (season === "spring") {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={containerStyle}
      >
        {elements.length > 0
          ? elements.map((el) => (
              <Petal
                key={el.id}
                left={el.left}
                delay={el.delay}
                duration={el.duration}
                size={el.size}
              />
            ))
          : null}
      </div>
    );
  }

  if (season === "summer") {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={containerStyle}
      >
        {elements.length > 0
          ? elements.map((el) => {
              if (el.type === "beachball") {
                return (
                  <BeachBall
                    key={el.id}
                    left={el.left}
                    delay={el.delay}
                    duration={el.duration}
                    size={el.size}
                  />
                );
              } else if (el.type === "palmleaf") {
                return (
                  <PalmLeaf
                    key={el.id}
                    left={el.left}
                    delay={el.delay}
                    duration={el.duration}
                    size={el.size}
                    rotation={el.rotation}
                  />
                );
              } else if (el.type === "shell") {
                return (
                  <Shell
                    key={el.id}
                    left={el.left}
                    delay={el.delay}
                    duration={el.duration}
                    size={el.size}
                    rotation={el.rotation}
                  />
                );
              }
              return null;
            })
          : null}
      </div>
    );
  }

  return null;
};

export default SeasonalEffects;

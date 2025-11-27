import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiFacebook,
  FiTrendingUp,
  FiBriefcase,
  FiCode,
  FiDatabase,
  FiCloud,
  FiSmartphone,
  FiMail,
  FiMapPin,
  FiBook,
  FiAward,
  FiExternalLink,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import profileImage from "@/assets/Profiile.jpg";
import { userAPI, projectsAPI } from "@/services/api";
import { useSeasonalTheme } from "@/contexts/SeasonalThemeContext";

const Home = () => {
  const [availableToWork, setAvailableToWork] = useState(true);
  const [projects, setProjects] = useState([]);
  const [projectCount, setProjectCount] = useState(10);
  const { activeSeason } = useSeasonalTheme();

  // Get seasonal background with landscape designs
  const getSeasonalBackground = (season) => {
    const baseClasses = "relative overflow-hidden";
    let gradientClasses = "";
    let landscapeSvg = null;

    switch (season) {
      case "winter":
        gradientClasses =
          "bg-gradient-to-b from-sky-100 via-blue-50 to-white dark:from-sky-950/40 dark:via-blue-950/30 dark:to-background";
        landscapeSvg = (
          <div className="absolute inset-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="winterSky"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient
                  id="winterSkyDark"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0C4A6E" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#075985" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#winterSky)"
                className="dark:fill-[url(#winterSkyDark)]"
              />
              <path
                d="M0,200 L80,120 L160,160 L240,100 L320,140 L400,100 L400,300 L0,300 Z"
                fill="#93C5FD"
                fillOpacity="0.4"
                className="dark:fill-blue-800 dark:opacity-30"
              />
              <path
                d="M0,220 L100,140 L200,180 L300,120 L400,160 L400,300 L0,300 Z"
                fill="#60A5FA"
                fillOpacity="0.3"
                className="dark:fill-blue-700 dark:opacity-25"
              />
              <path
                d="M80,120 L100,100 L120,120 L160,160 L140,140 L120,150 L80,120 Z"
                fill="#FFFFFF"
                fillOpacity="0.6"
                className="dark:opacity-40"
              />
              <path
                d="M240,100 L260,80 L280,100 L320,140 L300,120 L280,130 L240,100 Z"
                fill="#FFFFFF"
                fillOpacity="0.6"
                className="dark:opacity-40"
              />
              <path
                d="M60,200 L50,180 L60,170 L55,160 L65,150 L60,140 L70,150 L75,160 L65,170 L70,180 L60,200 Z"
                fill="#1E40AF"
                fillOpacity="0.3"
                className="dark:fill-blue-900 dark:opacity-25"
              />
              <path
                d="M150,190 L140,170 L150,160 L145,150 L155,140 L150,130 L160,140 L165,150 L155,160 L160,170 L150,190 Z"
                fill="#1E40AF"
                fillOpacity="0.3"
                className="dark:fill-blue-900 dark:opacity-25"
              />
              <path
                d="M280,180 L270,160 L280,150 L275,140 L285,130 L280,120 L290,130 L295,140 L285,150 L290,160 L280,180 Z"
                fill="#1E40AF"
                fillOpacity="0.3"
                className="dark:fill-blue-900 dark:opacity-25"
              />
              <rect
                x="0"
                y="200"
                width="400"
                height="100"
                fill="#E0F7FA"
                fillOpacity="0.5"
                className="dark:fill-cyan-950 dark:opacity-30"
              />
            </svg>
          </div>
        );
        break;
      case "spring":
        gradientClasses =
          "bg-gradient-to-b from-pink-100 via-rose-50 to-green-50 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-green-950/30";
        landscapeSvg = (
          <div className="absolute inset-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="springSky"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FCE7F3" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FDF2F8" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient
                  id="springSkyDark"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#831843" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9F1239" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#springSky)"
                className="dark:fill-[url(#springSkyDark)]"
              />
              <path
                d="M0,250 Q100,200 200,220 T400,210 L400,300 L0,300 Z"
                fill="#86EFAC"
                fillOpacity="0.4"
                className="dark:fill-green-800 dark:opacity-30"
              />
              <path
                d="M0,270 Q150,230 300,250 T400,240 L400,300 L0,300 Z"
                fill="#4ADE80"
                fillOpacity="0.3"
                className="dark:fill-green-700 dark:opacity-25"
              />
              <circle
                cx="100"
                cy="200"
                r="25"
                fill="#F9A8D4"
                fillOpacity="0.5"
                className="dark:fill-pink-800 dark:opacity-30"
              />
              <path
                d="M100,200 L95,240 L105,240 Z"
                fill="#22C55E"
                fillOpacity="0.4"
                className="dark:fill-green-700 dark:opacity-30"
              />
              <circle
                cx="100"
                cy="200"
                r="15"
                fill="#EC4899"
                fillOpacity="0.6"
                className="dark:fill-pink-700 dark:opacity-40"
              />
              <circle
                cx="250"
                cy="190"
                r="30"
                fill="#F9A8D4"
                fillOpacity="0.5"
                className="dark:fill-pink-800 dark:opacity-30"
              />
              <path
                d="M250,190 L245,240 L255,240 Z"
                fill="#22C55E"
                fillOpacity="0.4"
                className="dark:fill-green-700 dark:opacity-30"
              />
              <circle
                cx="250"
                cy="190"
                r="18"
                fill="#EC4899"
                fillOpacity="0.6"
                className="dark:fill-pink-700 dark:opacity-40"
              />
              <circle
                cx="320"
                cy="210"
                r="22"
                fill="#F9A8D4"
                fillOpacity="0.5"
                className="dark:fill-pink-800 dark:opacity-30"
              />
              <path
                d="M320,210 L315,240 L325,240 Z"
                fill="#22C55E"
                fillOpacity="0.4"
                className="dark:fill-green-700 dark:opacity-30"
              />
              <circle
                cx="320"
                cy="210"
                r="12"
                fill="#EC4899"
                fillOpacity="0.6"
                className="dark:fill-pink-700 dark:opacity-40"
              />
              <circle cx="50" cy="250" r="3" fill="#F472B6" fillOpacity="0.6" />
              <circle
                cx="150"
                cy="260"
                r="3"
                fill="#F472B6"
                fillOpacity="0.6"
              />
              <circle
                cx="200"
                cy="255"
                r="3"
                fill="#F472B6"
                fillOpacity="0.6"
              />
              <circle
                cx="350"
                cy="265"
                r="3"
                fill="#F472B6"
                fillOpacity="0.6"
              />
            </svg>
          </div>
        );
        break;
      case "summer":
        gradientClasses =
          "bg-gradient-to-b from-yellow-100 via-amber-50 to-blue-50 dark:from-yellow-950/40 dark:via-amber-950/30 dark:to-blue-950/30";
        landscapeSvg = (
          <div className="absolute inset-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="summerSky"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#FDE68A" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient
                  id="summerSkyDark"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#78350F" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#92400E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#summerSky)"
                className="dark:fill-[url(#summerSkyDark)]"
              />
              <circle
                cx="320"
                cy="80"
                r="35"
                fill="#FCD34D"
                fillOpacity="0.6"
                className="dark:fill-yellow-700 dark:opacity-40"
              />
              <rect
                x="0"
                y="180"
                width="400"
                height="120"
                fill="#3B82F6"
                fillOpacity="0.4"
                className="dark:fill-blue-800 dark:opacity-30"
              />
              <path
                d="M0,200 Q50,190 100,200 T200,200 T300,200 T400,200 L400,300 L0,300 Z"
                fill="#60A5FA"
                fillOpacity="0.3"
                className="dark:fill-blue-700 dark:opacity-25"
              />
              <path
                d="M0,220 Q40,210 80,220 T160,220 T240,220 T320,220 T400,220 L400,300 L0,300 Z"
                fill="#93C5FD"
                fillOpacity="0.2"
                className="dark:fill-blue-600 dark:opacity-20"
              />
              <rect
                x="0"
                y="180"
                width="400"
                height="20"
                fill="#FDE68A"
                fillOpacity="0.5"
                className="dark:fill-amber-900 dark:opacity-30"
              />
              <path
                d="M80,180 L75,140 L85,140 L80,180 Z"
                fill="#22C55E"
                fillOpacity="0.5"
                className="dark:fill-green-800 dark:opacity-30"
              />
              <path
                d="M80,140 Q60,120 70,100 Q80,120 100,100 Q90,120 80,140"
                fill="#16A34A"
                fillOpacity="0.4"
                className="dark:fill-green-700 dark:opacity-25"
              />
              <path
                d="M80,140 Q100,120 110,100 Q100,120 80,140"
                fill="#16A34A"
                fillOpacity="0.4"
                className="dark:fill-green-700 dark:opacity-25"
              />
              <path
                d="M280,180 L275,140 L285,140 L280,180 Z"
                fill="#22C55E"
                fillOpacity="0.5"
                className="dark:fill-green-800 dark:opacity-30"
              />
              <path
                d="M280,140 Q260,120 270,100 Q280,120 300,100 Q290,120 280,140"
                fill="#16A34A"
                fillOpacity="0.4"
                className="dark:fill-green-700 dark:opacity-25"
              />
              <path
                d="M280,140 Q300,120 310,100 Q300,120 280,140"
                fill="#16A34A"
                fillOpacity="0.4"
                className="dark:fill-green-700 dark:opacity-25"
              />
            </svg>
          </div>
        );
        break;
      case "fall":
        gradientClasses =
          "bg-gradient-to-b from-orange-100 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-yellow-950/30";
        landscapeSvg = (
          <div className="absolute inset-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="fallSky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient
                  id="fallSkyDark"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#7C2D12" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#92400E" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#fallSky)"
                className="dark:fill-[url(#fallSkyDark)]"
              />
              <path
                d="M0,250 Q100,200 200,230 T400,220 L400,300 L0,300 Z"
                fill="#F97316"
                fillOpacity="0.3"
                className="dark:fill-orange-900 dark:opacity-25"
              />
              <path
                d="M0,270 Q150,240 300,260 T400,250 L400,300 L0,300 Z"
                fill="#FB923C"
                fillOpacity="0.25"
                className="dark:fill-orange-800 dark:opacity-20"
              />
              <path
                d="M100,200 L95,240 L105,240 Z"
                fill="#92400E"
                fillOpacity="0.5"
                className="dark:fill-amber-900 dark:opacity-40"
              />
              <circle
                cx="100"
                cy="200"
                r="28"
                fill="#F97316"
                fillOpacity="0.5"
                className="dark:fill-orange-800 dark:opacity-35"
              />
              <circle
                cx="100"
                cy="200"
                r="20"
                fill="#FB923C"
                fillOpacity="0.6"
                className="dark:fill-orange-700 dark:opacity-40"
              />
              <path
                d="M220,190 L215,240 L225,240 Z"
                fill="#92400E"
                fillOpacity="0.5"
                className="dark:fill-amber-900 dark:opacity-40"
              />
              <circle
                cx="220"
                cy="190"
                r="32"
                fill="#DC2626"
                fillOpacity="0.4"
                className="dark:fill-red-900 dark:opacity-30"
              />
              <circle
                cx="220"
                cy="190"
                r="22"
                fill="#F97316"
                fillOpacity="0.5"
                className="dark:fill-orange-800 dark:opacity-35"
              />
              <path
                d="M320,210 L315,240 L325,240 Z"
                fill="#92400E"
                fillOpacity="0.5"
                className="dark:fill-amber-900 dark:opacity-40"
              />
              <circle
                cx="320"
                cy="210"
                r="26"
                fill="#EAB308"
                fillOpacity="0.5"
                className="dark:fill-yellow-800 dark:opacity-35"
              />
              <circle
                cx="320"
                cy="210"
                r="18"
                fill="#F59E0B"
                fillOpacity="0.6"
                className="dark:fill-amber-700 dark:opacity-40"
              />
              <ellipse
                cx="50"
                cy="250"
                rx="4"
                ry="6"
                fill="#F97316"
                fillOpacity="0.5"
                transform="rotate(-30 50 250)"
              />
              <ellipse
                cx="150"
                cy="260"
                rx="5"
                ry="7"
                fill="#DC2626"
                fillOpacity="0.4"
                transform="rotate(45 150 260)"
              />
              <ellipse
                cx="250"
                cy="255"
                rx="4"
                ry="6"
                fill="#EAB308"
                fillOpacity="0.5"
                transform="rotate(-20 250 255)"
              />
              <ellipse
                cx="350"
                cy="265"
                rx="5"
                ry="7"
                fill="#F97316"
                fillOpacity="0.5"
                transform="rotate(60 350 265)"
              />
            </svg>
          </div>
        );
        break;
      default:
        gradientClasses =
          "bg-gradient-to-br from-primary/5 via-primary/10 to-background";
        break;
    }

    return { baseClasses, gradientClasses, landscapeSvg };
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await userAPI.getStatus();
        setAvailableToWork(data.availableToWork);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching status:", error);
        }
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data.slice(0, 4)); // Show only first 4 projects
        setProjectCount(10 + data.length);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching projects:", error);
        }
      }
    };
    fetchProjects();
  }, []);

  const techStack = {
    frontend: ["JavaScript", "TypeScript", "React", "Tailwind CSS", "HTML/CSS"],
    backend: ["Node.js", "Express", "MongoDB", "REST APIs"],
    devops: ["AWS", "Git", "AWS AIOps"],
  };

  const experience = [
    {
      year: "2023 - Present",
      title: "AI Full-Stack Developer",
      description:
        "Building scalable web applications using modern technologies. Specializing in React, Node.js, and cloud infrastructure.",
    },
    {
      year: "2021 - 2023",
      title: "Frontend Developer",
      description:
        "Developed responsive user interfaces and improved user experience across multiple web applications.",
    },
  ];

  // Helper to get the correct image URL
  const getImageUrl = (path) => {
    if (!path) return "";
    // Convert localhost:5000 URLs to relative paths (fixes CORS in development)
    if (path.includes("localhost:5000")) {
      return path.replace(/^https?:\/\/[^/]+/, "");
    }
    // Keep external URLs as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    // Use relative path - works automatically with same domain
    return path.startsWith("/") ? path : `/${path}`;
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Picture */}
              <Card
                className={`${
                  getSeasonalBackground(activeSeason).baseClasses
                } ${getSeasonalBackground(activeSeason).gradientClasses}`}
              >
                {getSeasonalBackground(activeSeason).landscapeSvg}
                <CardContent className="pt-6 pb-6 relative z-10">
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={profileImage}
                        alt="Gian Daziel Pon"
                        className="w-48 h-48 rounded-2xl object-cover border-4 border-background shadow-lg"
                      />
                      {availableToWork && (
                        <div className="absolute -bottom-2 -right-2 bg-card border-2 border-primary/20 rounded-full p-2 shadow-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBriefcase className="h-5 w-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    I'm a passionate AI full-stack developer with a love for
                    creating beautiful, functional, and user-friendly web
                    applications. I enjoy turning complex problems into simple,
                    elegant solutions.
                  </p>
                  <p>
                    With expertise in both frontend and backend technologies, I
                    bring a comprehensive approach to web development. I'm
                    always learning new technologies and best practices to stay
                    at the forefront of the industry.
                  </p>
                  <p>
                    Currently, I'm expanding my expertise by learning{" "}
                    <span className="font-semibold text-foreground">
                      AWS AIOps
                    </span>
                    , exploring how artificial intelligence and machine learning
                    can enhance cloud operations and infrastructure management.
                  </p>
                  <p>
                    As a{" "}
                    <span className="font-semibold text-foreground">
                      freelancer
                    </span>
                    , I work with clients to deliver custom solutions that meet
                    their unique needs.
                  </p>
                </CardContent>
              </Card>

              {/* Tech Stack */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FiCode className="h-5 w-5" />
                      Tech Stack
                    </CardTitle>
                    <Link
                      to="/about"
                      className="text-xs text-primary hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {techStack.frontend.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Backend</h4>
                    <div className="flex flex-wrap gap-2">
                      {techStack.backend.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-xs rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      DevOps & Cloud
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {techStack.devops.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-xs rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Beyond Coding */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBook className="h-5 w-5" />
                    Beyond Coding
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                  <p>
                    When I'm not coding, you can find me exploring new
                    frameworks, contributing to open-source projects, or sharing
                    knowledge with the developer community. I'm passionate about
                    continuous learning and staying updated with emerging
                    technologies.
                  </p>
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
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://github.com/Ziel27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <FiGithub className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href="https://linkedin.com/in/gian-daziel-pon-982b37296"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <FiLinkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href="https://instagram.com/giii_daa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <FiInstagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href="https://facebook.com/gianpon27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <FiFacebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Get In Touch */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiMail className="h-5 w-5" />
                    Get In Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Available for freelance projects, collaborations, and
                    open-source contributions. Let's build something amazing
                    together!
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                      <FiMail className="h-4 w-4" />
                      <span>Send Email</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Banner */}
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        {projectCount}+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Projects Completed
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        3+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Years Experience
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBriefcase className="h-5 w-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experience.map((exp, index) => (
                      <div
                        key={index}
                        className="relative pl-6 border-l-2 border-primary/30"
                      >
                        <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-primary"></div>
                        <div>
                          <div className="text-xs font-semibold text-primary mb-1">
                            {exp.year}
                          </div>
                          <h4 className="font-bold mb-1">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="relative pl-6 border-l-2 border-primary/30">
                      <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <div className="text-xs font-semibold text-primary mb-1">
                          2020
                        </div>
                        <h4 className="font-bold mb-1">Hello World!</h4>
                        <p className="text-sm text-muted-foreground">
                          Wrote my first line of code
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FiCode className="h-5 w-5" />
                      Recent Projects
                    </CardTitle>
                    <Link
                      to="/projects"
                      className="text-xs text-primary hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No projects yet. Check back soon!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold mb-1">
                                {project.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {project.description}
                              </p>
                              {project.technologies &&
                                project.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-2">
                                    {project.technologies
                                      .slice(0, 3)
                                      .map((tech, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-0.5 text-xs rounded bg-muted"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                  </div>
                                )}
                              <div className="flex gap-2">
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                  >
                                    <FiExternalLink className="h-3 w-3" />
                                    Live Demo
                                  </a>
                                )}
                                {project.githubUrl && (
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                  >
                                    <FiGithub className="h-3 w-3" />
                                    Code
                                  </a>
                                )}
                              </div>
                            </div>
                            {project.imageUrl && (
                              <div className="flex-shrink-0">
                                <img
                                  src={getImageUrl(project.imageUrl)}
                                  alt={project.title}
                                  className="w-20 h-20 rounded-lg object-cover border"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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

export default Home;

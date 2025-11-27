import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FiExternalLink, FiGithub, FiCode, FiLayers } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projectsAPI } from "@/services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // Convert localhost:5000 URLs to relative paths (fixes CORS in development)
    if (imageUrl.includes("localhost:5000")) {
      return imageUrl.replace(/^https?:\/\/[^/]+/, "");
    }
    // Keep external URLs as-is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    // Use relative path - works automatically with same domain
    if (imageUrl.startsWith("/uploads/")) {
      return imageUrl;
    }
    return imageUrl;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching projects:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Projects - Gian Daziel Pon | Portfolio Showcase</title>
        <meta
          name="description"
          content="Explore my portfolio of web development projects built with React, Node.js, MongoDB, and modern technologies. See live demos and source code."
        />
        <meta
          property="og:title"
          content="Projects - Gian Daziel Pon | Portfolio Showcase"
        />
        <meta
          property="og:description"
          content="Explore my portfolio of web development projects built with modern technologies."
        />
        <meta
          property="og:url"
          content="https://giandazielpon.online/projects"
        />
        <link rel="canonical" href="https://giandazielpon.online/projects" />
      </Helmet>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                My Projects
              </h1>
              <p className="text-muted-foreground">
                A showcase of projects built with modern technologies, clean
                code, and attention to detail
              </p>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <FiCode className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground">
                      Check back soon for exciting projects!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 flex flex-col"
                  >
                    {project.imageUrl && (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={getImageUrl(project.imageUrl)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    <CardHeader className="relative">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <FiLayers className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative flex-1">
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies
                              .slice(0, 3)
                              .map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                    </CardContent>

                    <CardFooter className="relative flex gap-2 pt-0">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium group/link flex-1 justify-center"
                        >
                          <FiExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm font-medium group/link flex-1 justify-center"
                        >
                          <FiGithub className="h-4 w-4 group-hover/link:rotate-12 transition-transform" />
                          Code
                        </a>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;

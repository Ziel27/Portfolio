import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiGithub,
  FiLogOut,
  FiUpload,
  FiX,
  FiCheckCircle,
  FiSettings,
} from "react-icons/fi";
import { useSeasonalTheme } from "@/contexts/SeasonalThemeContext";
import { getSeasonName, getSeasonEmoji } from "@/utils/seasons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projectsAPI, uploadAPI, userAPI } from "@/services/api";

const AdminDashboard = ({ setIsAuthenticated }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [availableToWork, setAvailableToWork] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const { themeMode, activeSeason, currentSeason, updateThemeMode } =
    useSeasonalTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imageFile: null,
    liveUrl: "",
    githubUrl: "",
    technologies: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchStatus();
  }, []);

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

  const fetchStatus = async () => {
    try {
      const data = await userAPI.getStatus();
      setAvailableToWork(data.availableToWork);
      // Theme mode is managed by SeasonalThemeContext
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching status:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/admin/login");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadAPI.uploadProjectImage(file);
      // Use relative path from API response
      setFormData({
        ...formData,
        imageUrl: result.imageUrl,
        imageFile: null,
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Upload error:", error);
      }
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleStatusToggle = async () => {
    setStatusLoading(true);
    try {
      const newStatus = !availableToWork;
      await userAPI.updateStatus(newStatus);
      setAvailableToWork(newStatus);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error updating status:", error);
      }
      alert("Failed to update status. Please try again.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0),
      };

      // Remove imageFile from data
      delete projectData.imageFile;

      if (editingProject) {
        await projectsAPI.update(editingProject.id, projectData);
      } else {
        await projectsAPI.create(projectData);
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error saving project:", error);
      }
      alert("Failed to save project. Please try again.");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      imageUrl: project.imageUrl || "",
      imageFile: null,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      technologies: (project.technologies || []).join(", "),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await projectsAPI.delete(id);
      fetchProjects();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error deleting project:", error);
      }
      alert("Failed to delete project. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      imageFile: null,
      liveUrl: "",
      githubUrl: "",
      technologies: "",
    });
    setEditingProject(null);
    setShowForm(false);
  };

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your portfolio projects
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLogout} variant="outline">
              <FiLogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Status Toggle Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
              <CardDescription>
                Control whether you appear as "Available to Work" on your
                portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Available to Work</p>
                  <p className="text-sm text-muted-foreground">
                    {availableToWork
                      ? "This status is currently visible on your home page"
                      : "This status is currently hidden on your home page"}
                  </p>
                </div>
                <Button
                  onClick={handleStatusToggle}
                  disabled={statusLoading}
                  variant={availableToWork ? "default" : "outline"}
                  className="min-w-[120px]"
                >
                  {statusLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Updating...
                    </div>
                  ) : availableToWork ? (
                    <>
                      <FiCheckCircle className="mr-2 h-4 w-4" />
                      Available
                    </>
                  ) : (
                    <>
                      <FiX className="mr-2 h-4 w-4" />
                      Not Available
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Theme Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiSettings className="h-5 w-5" />
                Seasonal Theme
              </CardTitle>
              <CardDescription>
                Control the seasonal theme and animations on your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Current Theme</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">
                      {themeMode === "disabled"
                        ? "🚫"
                        : themeMode === "auto"
                        ? getSeasonEmoji(currentSeason)
                        : getSeasonEmoji(themeMode)}
                    </span>
                  <div>
                    <p className="font-semibold">
                      {themeMode === "disabled"
                        ? "Disabled"
                        : themeMode === "auto"
                        ? `Auto (${getSeasonName(currentSeason)})`
                        : getSeasonName(themeMode)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {themeMode === "disabled"
                        ? "Seasonal themes are currently disabled"
                        : themeMode === "auto"
                        ? "Theme changes automatically with seasons"
                        : "Theme is manually set"}
                    </p>
                  </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Theme Mode</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button
                      onClick={() => updateThemeMode("auto")}
                      variant={themeMode === "auto" ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      Auto
                    </Button>
                    <Button
                      onClick={() => updateThemeMode("winter")}
                      variant={themeMode === "winter" ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      ❄️ Winter
                    </Button>
                    <Button
                      onClick={() => updateThemeMode("spring")}
                      variant={themeMode === "spring" ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      🌸 Spring
                    </Button>
                    <Button
                      onClick={() => updateThemeMode("summer")}
                      variant={themeMode === "summer" ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      ☀️ Summer
                    </Button>
                    <Button
                      onClick={() => updateThemeMode("fall")}
                      variant={themeMode === "fall" ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      🍂 Fall
                    </Button>
                  </div>
                  <Button
                    onClick={() => updateThemeMode("disabled")}
                    variant={
                      themeMode === "disabled"
                        ? "destructive"
                        : "outline"
                    }
                    size="sm"
                    className="w-full"
                  >
                    <FiX className="mr-2 h-4 w-4" />
                    {themeMode === "disabled" ? "Disabled" : "Disable Theme"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </CardTitle>
              <CardDescription>
                Fill in the details below to {editingProject ? "update" : "add"}{" "}
                a project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-2"
                  >
                    Title *
                  </label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Project title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2"
                  >
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Project description"
                    rows={4}
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium mb-2"
                  >
                    Project Image
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="cursor-pointer"
                      />
                      {uploading && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Uploading...
                        </div>
                      )}
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={
                            formData.imageUrl.includes("localhost:5000")
                              ? formData.imageUrl.replace(
                                  /^https?:\/\/[^/]+/,
                                  ""
                                )
                              : formData.imageUrl
                          }
                          alt="Preview"
                          className="w-full max-w-xs h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              imageUrl: "",
                              imageFile: null,
                            })
                          }
                          className="mt-2"
                        >
                          <FiX className="mr-2 h-4 w-4" />
                          Remove Image
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Or enter an image URL below (max 5MB for upload)
                    </p>
                    <Input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="liveUrl"
                      className="block text-sm font-medium mb-2"
                    >
                      Live URL
                    </label>
                    <Input
                      id="liveUrl"
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, liveUrl: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="githubUrl"
                      className="block text-sm font-medium mb-2"
                    >
                      GitHub URL
                    </label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="technologies"
                    className="block text-sm font-medium mb-2"
                  >
                    Technologies (comma-separated)
                  </label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData({ ...formData, technologies: e.target.value })
                    }
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={uploading}>
                    {editingProject ? "Update" : "Create"} Project
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            // Helper to get full image URL
            const getImageUrl = (imageUrl) => {
              if (!imageUrl) return null;
              // Convert localhost:5000 URLs to relative paths (fixes CORS in development)
              if (imageUrl.includes("localhost:5000")) {
                return imageUrl.replace(/^https?:\/\/[^/]+/, "");
              }
              // Keep external URLs as-is
              if (
                imageUrl.startsWith("http://") ||
                imageUrl.startsWith("https://")
              ) {
                return imageUrl;
              }
              // Use relative path - works automatically with same domain
              if (imageUrl.startsWith("/uploads/")) {
                return imageUrl;
              }
              return imageUrl;
            };

            return (
              <Card key={project.id} className="flex flex-col">
                {project.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={getImageUrl(project.imageUrl)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (import.meta.env.DEV) {
                          console.error(
                            "Failed to load image:",
                            project.imageUrl
                          );
                        }
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardContent className="flex gap-2 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(project)}
                    className="flex-1"
                  >
                    <FiEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="flex-1"
                  >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {projects.length === 0 && !showForm && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">
              No projects yet.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

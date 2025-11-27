import User from '../models/User.js';
import Project from '../models/Project.js';

// Note: verifyPassword is now handled by User model's comparePassword method

// User operations
export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const createUser = async (email, password) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return null;
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// verifyPassword is now handled by the User model's comparePassword method

// Project operations
export const getAllProjects = async () => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return projects.map(project => ({
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      technologies: project.technologies,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const project = await Project.findById(id);
    if (!project) {
      return null;
    }
    return {
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      technologies: project.technologies,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  } catch (error) {
    console.error('Error getting project by id:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const project = await Project.create(projectData);
    return {
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      technologies: project.technologies,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { ...projectData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return null;
    }

    return {
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      technologies: project.technologies,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true,
  },
  liveUrl: {
    type: String,
    default: '',
    trim: true,
  },
  githubUrl: {
    type: String,
    default: '',
    trim: true,
  },
  technologies: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;


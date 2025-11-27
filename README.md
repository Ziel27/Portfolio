# Professional Portfolio Website

A full-stack portfolio website with an admin panel for managing projects. Built with React, Node.js, Express, and modern web technologies.

## Features

- **Portfolio Website**: Beautiful, responsive portfolio showcasing your projects
- **Admin Dashboard**: Secure login system to manage projects
- **Project Management**: Add, edit, and delete projects from the admin panel
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- shadcn/ui
- React Icons
- React Router
- Axios

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Make sure MongoDB is running on your system (or use MongoDB Atlas)

4. Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
```

For MongoDB Atlas, use:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

4. Start the backend server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Accessing the Portfolio

1. Open your browser and navigate to `http://localhost:3000`
2. Browse through the Home, Projects, About, and Contact pages

### Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Register a new account or login with existing credentials
3. Once logged in, you'll be redirected to the admin dashboard
4. Add, edit, or delete projects from the dashboard
5. Projects added in the admin panel will automatically appear on the portfolio's Projects page

## Project Structure

```
portfolio/
├── backend/
│   ├── data/           # JSON database files (auto-created)
│   ├── middleware/     # Authentication middleware
│   ├── routes/         # API routes
│   ├── utils/          # Database utilities
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── lib/        # Utility functions
│   └── public/         # Static assets
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Projects (Public)

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a single project

### Projects (Protected - Requires JWT)

- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

## Security Notes

- Change the `JWT_SECRET` in production to a strong, random string
- Use a secure MongoDB connection string in production
- Never commit your `.env` file to version control
- Consider using environment variables for all sensitive data

## Building for Production

### Backend

The backend runs directly with Node.js. For production, consider using:

- PM2 for process management
- Environment variables for configuration
- A proper database instead of JSON files

### Frontend

Build the frontend for production:

```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory, ready to be served by any static file server.

## License

This project is open source and available under the MIT License.

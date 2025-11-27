# Portfolio Backend API

Express.js backend with MongoDB, JWT authentication for the portfolio website.

## Setup

1. Make sure MongoDB is running (local or MongoDB Atlas)

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
```

   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

4. Start the server:
```bash
npm start
```

The server will automatically connect to MongoDB on startup.

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: { email: string, password: string }
```

#### Login
```
POST /api/auth/login
Body: { email: string, password: string }
```

### Project Endpoints

#### Get All Projects (Public)
```
GET /api/projects
```

#### Get Single Project (Public)
```
GET /api/projects/:id
```

#### Create Project (Protected)
```
POST /api/projects
Headers: Authorization: Bearer <token>
Body: {
  title: string (required),
  description: string (required),
  imageUrl: string (optional),
  liveUrl: string (optional),
  githubUrl: string (optional),
  technologies: string[] (optional)
}
```

#### Update Project (Protected)
```
PUT /api/projects/:id
Headers: Authorization: Bearer <token>
Body: Same as Create Project
```

#### Delete Project (Protected)
```
DELETE /api/projects/:id
Headers: Authorization: Bearer <token>
```


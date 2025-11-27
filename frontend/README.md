# Portfolio Frontend

React.js frontend for the portfolio website built with Vite, Tailwind CSS, and shadcn/ui.

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

## Build

Build for production:
```bash
npm run build
```

## Pages

- `/` - Home page
- `/projects` - Projects showcase
- `/about` - About page
- `/contact` - Contact page
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard (protected)

## Components

The project uses shadcn/ui components. To add more components:

```bash
npx shadcn-ui@latest add [component-name]
```


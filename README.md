# Rate Limiter Dashboard

A visual demonstration of API rate limiting built with React and Express. This project showcases how rate limiting protects APIs from abuse and manages server resources.

## What is Rate Limiting?

Rate limiting controls how many requests can be made to an API within a specific time window. This is essential for:

- Preventing API abuse and spam
- Managing server load and costs
- Ensuring fair resource allocation among users
- Protecting against DDoS attacks

## Features

- Three different rate-limited endpoints (strict, moderate, generous)
- Real-time visual feedback with progress bars
- Countdown timers showing when limits reset
- Request history log for observability
- Clean, professional UI demonstrating production concepts
- Full-stack implementation with Node.js backend and React frontend

## Tech Stack

**Backend**
- Node.js
- Express
- express-rate-limit middleware
- CORS enabled

**Frontend**
- React
- Vite
- Modern CSS with responsive design

## Live Demo

- Frontend: https://rate-limiter-dashboard.vercel.app
- Backend API: https://rate-limiter-api-lcsf.onrender.com

**Note**: The backend is hosted on Render's free tier, which spins down after periods of inactivity. The first API request after inactivity may take 20-30 seconds to respond while the server restarts. Subsequent requests will be instant. In a production environment, this would use an always-on instance for consistent performance.

## Local Development

### Prerequisites
- Node.js installed
- npm or yarn

### Backend
```bash
cd backend
npm install
npm start
```

The API will run on http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The dashboard will run on http://localhost:5173

## API Endpoints

- `GET /api/strict` - 5 requests per minute
- `GET /api/moderate` - 10 requests per minute
- `GET /api/generous` - 20 requests per minute

Each endpoint returns:
- Request success/failure status
- Remaining requests in the current window
- Time until the limit resets
- Current usage statistics

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set root directory: `backend`
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Deploy

### Frontend (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set root directory: `frontend`
4. Add environment variable: `VITE_API_URL=<your-render-backend-url>`
5. Deploy

## Project Structure
```
rate-limiter-dashboard/
├── backend/
│   ├── server.js          # Express API with rate limiting
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Dashboard styling
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Why This Matters

For production systems, especially billing and payment processing:
- Rate limiting prevents accidental infinite loops from overwhelming your API
- Protects expensive third-party service calls
- Ensures system stability under load
- Demonstrates understanding of production-ready backend concepts beyond CRUD operations

## Author

Built by Lars M. - Computer Science student at UNC Charlotte

Demonstrating production-ready backend concepts including middleware, API design, and resource management.

## License

MIT
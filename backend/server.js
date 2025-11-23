const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Strict rate limiter - 5 requests per minute
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Too many requests.',
      limit: 5,
      windowMs: 60000,
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  }
});

// Moderate rate limiter - 10 requests per minute
const moderateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Rate limit reached. Please slow down.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please wait before trying again.',
      limit: 10,
      windowMs: 60000,
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  }
});

// Generous rate limiter - 20 requests per minute
const generousLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Even our generous limit has been reached!',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded on generous endpoint.',
      limit: 20,
      windowMs: 60000,
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rate Limiter API - Demo by Lars',
    endpoints: {
      '/api/strict': '5 requests per minute',
      '/api/moderate': '10 requests per minute',
      '/api/generous': '20 requests per minute'
    }
  });
});

// Strict endpoint
app.get('/api/strict', strictLimiter, (req, res) => {
  res.json({
    success: true,
    message: 'Request successful on strict endpoint',
    endpoint: 'strict',
    limit: 5,
    remaining: req.rateLimit.remaining,
    resetTime: new Date(req.rateLimit.resetTime).getTime(),    windowMs: 60000
  });
});

// Moderate endpoint
app.get('/api/moderate', moderateLimiter, (req, res) => {
  res.json({
    success: true,
    message: 'Request successful on moderate endpoint',
    endpoint: 'moderate',
    limit: 10,
    remaining: req.rateLimit.remaining,
    resetTime: new Date(req.rateLimit.resetTime).getTime(),    windowMs: 60000
  });
});

// Generous endpoint
app.get('/api/generous', generousLimiter, (req, res) => {
  res.json({
    success: true,
    message: 'Request successful on generous endpoint',
    endpoint: 'generous',
    limit: 20,
    remaining: req.rateLimit.remaining,
    resetTime: new Date(req.rateLimit.resetTime).getTime(),
    windowMs: 60000
  });
});

app.listen(PORT, () => {
  console.log(`Rate limiter API running on port ${PORT}`);
});
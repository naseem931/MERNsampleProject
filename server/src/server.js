import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { User } from './models/User.js';
import { seedData } from './seed.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
await connectDB();

// If database is empty, seed demo data automatically for instant out-of-the-box experience
try {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('⚡ Empty database detected. Auto-seeding initial demo data...');
    await seedData(false);
  }
} catch (e) {
  console.warn('Auto-seed check skipped:', e.message);
}

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Logging & Body parsing
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: `${Math.round(process.uptime())}s`,
  });
});

// Root API Welcome & Endpoint Directory
const apiIndexHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tasks90 REST API is operational 🚀',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        users: 'GET /api/auth/users',
      },
      projects: {
        list: 'GET /api/projects',
        create: 'POST /api/projects',
        getById: 'GET /api/projects/:id',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id',
      },
      tasks: {
        list: 'GET /api/tasks',
        create: 'POST /api/tasks',
        updateStatus: 'PATCH /api/tasks/:id/status',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
      },
      analytics: {
        dashboard: 'GET /api/analytics/dashboard',
      },
    },
    frontendApp: process.env.CLIENT_URL || 'http://localhost:5173',
  });
};

app.get('/', apiIndexHandler);
app.get('/api', apiIndexHandler);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 DevFlow Backend Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`👉 API Base URL: http://localhost:${PORT}/api`);
});

export default app;

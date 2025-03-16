require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./config/database');
const swaggerSpec = require('./config/swagger');
const appConfig = require('./config/app');
const errorHandler = require('./middleware/error');
const ApiError = require('./utils/ApiError');
const gracefulShutdown = require('./utils/gracefulShutdown');

// Import routes
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/surveys');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors(appConfig.corsOptions));
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(`${appConfig.contextPath}/auth`, authRoutes);
app.use(`${appConfig.contextPath}/surveys`, surveyRoutes);
app.use(`${appConfig.contextPath}/users`, userRoutes);

// Handle 404 routes
app.use('*', (req, res, next) => {
  next(ApiError.notFound(`Cannot find ${req.originalUrl} on this server`));
});

// Global error handler
app.use(errorHandler);

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error);
  // Log to error monitoring service (e.g., Sentry, NewRelic, etc.)
  
  // In development, crash the app to prevent undefined behavior
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(error);
  // Log to error monitoring service
  
  // In development, crash the app to prevent undefined behavior
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Graceful shutdown signals
['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal) => {
  process.on(signal, () => gracefulShutdown.shutdown(signal));
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    const server = app.listen(appConfig.port, () => {
      console.log(`Server running on port ${appConfig.port}`);
      console.log(`API Documentation available at http://localhost:${appConfig.port}/api-docs`);
      console.log(`API Base URL: http://localhost:${appConfig.port}${appConfig.contextPath}`);
    });

    // Initialize graceful shutdown with server instance
    gracefulShutdown.init(server);

    // Handle server-specific errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      // Log to error monitoring service
    });

  } catch (error) {
    console.error('Could not connect to the database:', error);
    process.exit(1);
  }
}

startServer(); 
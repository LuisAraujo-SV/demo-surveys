require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./config/database');
const swaggerSpec = require('./config/swagger');
const appConfig = require('./config/app');
const errorHandler = require('./middleware/error');
const ApiError = require('./utils/ApiError');

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

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', err);
  
  // Gracefully shutdown
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', err);
  
  // Gracefully shutdown
  process.exit(1);
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    app.listen(appConfig.port, () => {
      console.log(`Server running on port ${appConfig.port}`);
      console.log(`API Documentation available at http://localhost:${appConfig.port}/api-docs`);
      console.log(`API Base URL: http://localhost:${appConfig.port}${appConfig.contextPath}`);
    });
  } catch (error) {
    console.error('Could not connect to the database:', error);
    process.exit(1);
  }
}

startServer(); 
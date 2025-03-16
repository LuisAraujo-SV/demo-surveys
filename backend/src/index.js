require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./config/database');
const swaggerSpec = require('./config/swagger');
const appConfig = require('./config/app');
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/surveys');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors(appConfig.corsOptions));
app.use(express.json());

// Swagger documentation route - keep it at root level for easy access
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(`${appConfig.contextPath}/auth`, authRoutes);
app.use(`${appConfig.contextPath}/surveys`, surveyRoutes);
app.use(`${appConfig.contextPath}/users`, userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
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
  }
}

startServer(); 
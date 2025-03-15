require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');
const { sequelize } = require('./db/config');
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/surveys');
const userRoutes = require('./routes/users');

const app = express();
const contextPath = process.env.CONTEXT_PATH || '/api/v1';

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation route - keep it at root level for easy access
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(`${contextPath}/auth`, authRoutes);
app.use(`${contextPath}/surveys`, surveyRoutes);
app.use(`${contextPath}/users`, userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo salió mal!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`API Base URL: http://localhost:${PORT}${contextPath}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}

startServer(); 
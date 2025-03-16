const config = {
  development: {
    port: process.env.PORT || 3001,
    contextPath: process.env.CONTEXT_PATH || '/api/v1',
    corsOptions: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    },
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  test: {
    port: process.env.PORT || 3002,
    contextPath: process.env.CONTEXT_PATH || '/api/v1',
    corsOptions: {
      origin: 'http://localhost:3000',
      credentials: true
    },
    jwtSecret: 'test-secret-key',
    jwtExpiresIn: '24h'
  },
  production: {
    port: process.env.PORT,
    contextPath: process.env.CONTEXT_PATH || '/api/v1',
    corsOptions: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};

const env = process.env.NODE_ENV || 'development';
const appConfig = config[env];

module.exports = appConfig; 
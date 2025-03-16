const { sequelize } = require('../config/database');

class GracefulShutdown {
  constructor() {
    this.server = null;
    this.isShuttingDown = false;
  }

  init(server) {
    this.server = server;
  }

  async shutdown(signal) {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;
    
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    try {
      // Stop accepting new connections
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
        console.log('HTTP server closed');
      }

      // Close database connection
      if (sequelize) {
        await sequelize.close();
        console.log('Database connections closed');
      }

      // Add any other cleanup tasks here (e.g., Redis, message queues, etc.)
      
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
}

module.exports = new GracefulShutdown(); 
const { Sequelize } = require('sequelize');

// Load environment variables
require('dotenv').config();

const config = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  schema: process.env.DB_SCHEMA || 'surveys_schema',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  logging: console.log // Enable logging to debug issues
};

// Create a connection without schema specification first
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Function to initialize schema
const initializeSchema = async () => {
  try {
    // Create schema if it doesn't exist
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${config.schema};`);
    
    // Set search path to our schema
    await sequelize.query(`SET search_path TO ${config.schema},public;`);
    
    console.log('Schema initialized successfully');
  } catch (error) {
    console.error('Error initializing schema:', error);
    throw error;
  }
};

// Add schema to sequelize instance
sequelize.options.schema = config.schema;

// Export both sequelize instance and initialization function
module.exports = {
  sequelize,
  initializeSchema
}; 
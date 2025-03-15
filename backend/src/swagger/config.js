const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const contextPath = process.env.CONTEXT_PATH || '/api/v1';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Survey Rewards API',
      version: '1.0.0',
      description: 'API documentation for the Survey Rewards platform',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}${contextPath}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            category: { type: 'string' },
            points: { type: 'integer' },
          },
        },
        Survey: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { 
              type: 'string',
              enum: ['Technology', 'Sports', 'Fashion', 'Entertainment']
            },
            points: { type: 'integer' },
            questions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Question' }
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            text: { type: 'string' },
            type: { 
              type: 'string',
              enum: ['text', 'single_choice', 'multiple_choice']
            },
            options: { 
              type: 'array',
              items: { type: 'string' }
            },
            required: { type: 'boolean' }
          }
        }
      },
    },
    example: {
      answers: [
        {
          question_id: 1,
          answer: "Samsung"
        },
        {
          question_id: 2,
          answer: ["Camera", "Battery"]
        },
        {
          question_id: 3,
          answer: "Approximately 4 hours daily"
        }
      ]
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options); 
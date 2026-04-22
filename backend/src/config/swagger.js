const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PrimeIntern Task Manager API',
      version: '1.0.0',
      description: 'A scalable REST API with JWT Authentication & Role-Based Access Control for managing tasks.',
      contact: {
        name: 'Dhruv',
        email: 'developer@primeintern.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server (v1)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '663f1a2b3c4d5e6f7a8b9c0d' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '663f1a2b3c4d5e6f7a8b9c0d' },
            title: { type: 'string', example: 'Complete API documentation' },
            description: { type: 'string', example: 'Write Swagger docs for all endpoints' },
            status: { type: 'string', enum: ['todo', 'in-progress', 'done'], example: 'todo' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
            dueDate: { type: 'string', format: 'date', example: '2026-05-01' },
            user: { type: 'string', example: '663f1a2b3c4d5e6f7a8b9c0d' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

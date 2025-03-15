# Survey Rewards Platform - Backend

A RESTful API for a survey rewards platform that allows users to participate in surveys and earn points for their responses. Built with Node.js, Express, and PostgreSQL.

## Features

- User authentication (registration and login)
- JWT-based authorization
- Survey management and responses
- Points system for completed surveys
- User profile management
- Survey response history

## Technologies

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Swagger Documentation

## Project Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation and Setup
1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres
JWT_SECRET=your_secret_key
CONTEXT_PATH=/survey-app
```

4. Run database migrations:
```bash
node src/db/migrate.js
```

5. Start the development server:
```bash
npm run dev
```

## API Documentation

### Available documentation

Swagger documentation available when starting the server. Under this path for example

    http://localhost:3001/api-docs


## Default Admin Account

After running migrations, you can log in with:
- Email: admin@example.com
- Password: admin123

## Available Scripts

- `npm run dev`: Start development server
- `npm start`: Start production server
- `npm run migrate`: Run database migrations

## Next Steps

- Frontend development (Coming soon)
  - Will be built with Next.js
  - Will include user interface for surveys
  - Will implement authentication flow
  - Will add dashboard and profile management

## License

This project is licensed under the MIT License.

# Survey Rewards Platform

A full-stack application that allows users to earn points by completing surveys. Built with Next.js 14 (Frontend) and Node.js/Express (Backend).

## Project Overview

This project demonstrates modern full-stack development practices, including:

- Type-safe development with TypeScript
- Real-time data management with React Query
- RESTful API design with Express
- Database modeling with Sequelize ORM
- Authentication with JWT
- Clean architecture and separation of concerns
- Responsive UI with Tailwind CSS

## Technologies

### Backend

- Node.js & Express
- PostgreSQL
- Sequelize ORM
- JSON Web Tokens (JWT)
- Zod for validation
- Swagger for API documentation

### Frontend

- Next.js 14 (App Router)
- TypeScript
- React Query
- Tailwind CSS
- React Hook Form
- Headless UI

## Setup Instructions

### Backend

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file with the following content:
   ```env
   PORT=3001
   NODE_ENV=development
   CONTEXT_PATH=/survey-app
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Run migrations:**
   ```bash
   npm run migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   Create a `.env.local` file and add your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/survey-app
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Project Structure

### Backend

```
backend/
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── dto/               # Data Transfer Objects (DTOs)
│   ├── middleware/        # Custom middlewares
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── scripts/           # migration script
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── .env                   # Environment variables
└── package.json           # Project metadata and scripts
```

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard and survey pages
│   │   └── layout.tsx     # Root layout
│   ├── components/        # Reusable components
│   ├── lib/
│   │   ├── api.ts         # API service
│   │   └── utils.ts       # Helper functions
│   ├── providers/         # Context providers
│   └── middleware/        # middleware to validate token cookie
├── .env.local             # Environment variables
└── package.json           # Project metadata and scripts
```

## Key Features Implementation

1. **Authentication Flow**
   - JWT-based auth with local storage
   - Protected routes with middleware
   - Auto-logout on token expiration

2. **Data Management**
   - React Query for server state
   - Optimistic updates for better UX
   - Cache invalidation strategies
   - Type-safe API calls

3. **Form Handling**
   - Validation with React Hook Form
   - Error messages
   - Loading states
   - File upload support

4. **Cache Strategy**
   ```typescript
   // Example of optimistic updates
   const submitMutation = useMutation({
     onSuccess: async () => {
       // Update user points immediately
       queryClient.setQueryData(['user-profile'], {...});
       // Remove completed survey
       queryClient.setQueryData(['surveys'], {...});
       // Add to history
       queryClient.setQueryData(['survey-history'], {...});
       // Validate with server
       await queryClient.invalidateQueries({...});
     },
   });
   ```

## Best Practices

### Backend
- Use TypeScript for type safety
- Implement proper error handling
- Follow RESTful conventions
- Use middleware for common operations
- Validate all inputs
- Use environment variables
- Write unit tests
- Document API endpoints

### Frontend
- Use TypeScript strictly
- Implement proper loading states
- Handle errors gracefully
- Use proper cache invalidation
- Implement optimistic updates
- Follow atomic design principles
- Use proper type definitions
- Implement responsive design

## Development Workflow

1. Start backend server
2. Start frontend development server
3. Access the application at http://localhost:3000

## API Documentation

Available at:
```
http://localhost:3001/api-docs
```

## Default Admin Account
- Email: admin@example.com
- Password: admin123

## License

This project is licensed under the MIT License.

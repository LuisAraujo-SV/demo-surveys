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

## Backend Implementation

### Technologies

- Node.js & Express
- PostgreSQL
- Sequelize ORM
- JSON Web Tokens (JWT)
- Zod for validation
- Swagger for API documentation

### Features

- JWT-based authentication
- RESTful API endpoints
- Database migrations and seeding
- Input validation with Zod
- Error handling middleware
- Swagger API documentation
- Unit tests with Jest

### Database Schema

- user
  - id (PK)
  - name
  - email
  - password
  - points
  - category


- survey
  - id (PK)
  - title
  - description
  - category
  - points
  - questions (JSONB)


- question
  - id (PK)
  - survey_id (FK)
  - text
  - type
  - options
  - required
  - created_at
  - updated_at


- survey_response
  - id (PK)
  - user_id (FK)
  - survey_id (FK)
  - answers (JSONB)
  - points_earned
  - created_at

### Setup Instructions

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment:
   ```bash
   # Create .env file with the following content:
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

3. Run migrations:
   ```bash
   cd db
   node migrate.js
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Frontend Implementation

### Technologies

- Next.js 14 (App Router)
- TypeScript
- React Query
- Tailwind CSS
- React Hook Form
- Headless UI

### Features

- Server and Client Components
- Optimistic Updates
- Form Validation
- Responsive Design
- Real-time Cache Management
- Protected Routes
- Loading States
- Error Handling

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard and survey pages
│   │   └── layout.tsx     # Root layout
│   ├── components/        # Reusable components
│   ├── lib/
│   │   ├── api.ts        # API service
│   │   └── utils.ts      # Helper functions
│   └── providers/        # Context providers
```

### Key Features Implementation

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

### Setup Instructions

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env.local
   # Add your API URL
   ```

3. Start development server:
   ```bash
   npm run dev
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

## Testing

### Backend
```bash
cd backend
npm run test
```

### Frontend
```bash
cd frontend
npm run test
```

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

const { z } = require('zod');

// Register DTO
const registerDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  category: z.enum(['Technology', 'Healthcare', 'Education', 'Finance', 'Entertainment', 'Other'])
});

// Login DTO
const loginDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

module.exports = {
  registerDto,
  loginDto
}; 
const { z } = require('zod');
const { CategoryEnum } = require('../config/category');

// Register DTO
const registerDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  category: CategoryEnum
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
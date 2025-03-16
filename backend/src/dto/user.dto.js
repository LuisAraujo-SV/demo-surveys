const { z } = require('zod');

// Update Profile DTO
const updateProfileDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  category: z.enum(['Technology', 'Healthcare', 'Education', 'Finance', 'Entertainment', 'Other']).optional()
});

// Change Password DTO
const changePasswordDto = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long')
});

module.exports = {
  updateProfileDto,
  changePasswordDto
}; 
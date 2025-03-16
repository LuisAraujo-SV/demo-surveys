const { z } = require('zod');
const { CategoryEnum } = require('../config/category');
// Update Profile DTO
const updateProfileDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  category: CategoryEnum.optional()
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
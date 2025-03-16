const { z } = require('zod');

// Global constant with Zod enum
const CategoryEnum = z.enum([
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Entertainment',
  'Sports',
  'Fashion',
  'Other',
]);

module.exports = {
  CategoryEnum
};

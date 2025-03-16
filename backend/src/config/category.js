const { z } = require('zod');

// Global constant with Zod enum
const CategoryEnum = z.enum([
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Entertainment',
  'Other',
]);

module.exports = {
  CategoryEnum
};

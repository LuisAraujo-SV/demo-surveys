const { z } = require('zod');
const { CategoryEnum } = require('../config/category');
// Create Survey DTO
const createSurveyDto = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  category: CategoryEnum,
  questions: z.array(
    z.object({
      text: z.string().min(1, 'Question text is required'),
      type: z.enum(['multiple', 'single', 'text']),
      options: z.array(z.string())
    })
  ).min(1, 'At least one question is required'),
  pointsReward: z.number().int().positive().default(10)
});

// Survey Response DTO
const surveyResponseDto = z.object({
  answers: z.array(
    z.object({
      question_id: z.number().int().positive(),
      answer: z.union([
        z.string(),
        z.array(z.string())
      ])
    })
  ).min(1, 'At least one answer is required')
});

// Update Survey DTO
const updateSurveyDto = createSurveyDto.partial();

module.exports = {
  createSurveyDto,
  surveyResponseDto,
  updateSurveyDto
}; 
const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const surveyController = require('../controllers/survey.controller');

const router = express.Router();

/**
 * @swagger
 * /surveys:
 *   get:
 *     summary: Get all available surveys
 *     tags: [Surveys]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of available surveys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Survey'
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, surveyController.getAllSurveys);

/**
 * @swagger
 * /surveys/{id}:
 *   get:
 *     summary: Get a specific survey
 *     tags: [Surveys]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Survey ID
 *     responses:
 *       200:
 *         description: Survey details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Survey'
 *       404:
 *         description: Survey not found
 */
router.get('/:id', auth, surveyController.getSurveyById);

// Survey validation schema
const createSurveySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['Technology', 'Sports', 'Fashion']),
  questions: z.array(z.object({
    text: z.string(),
    type: z.enum(['multiple', 'single', 'text']),
    options: z.array(z.string())
  })).min(1),
  pointsReward: z.number().int().positive().default(10)
});

// Create new survey (admin only)
router.post('/', auth, surveyController.createSurvey);

// Response validation schema
const surveyResponseSchema = z.object({
  answers: z.array(z.object({
    question_id: z.number(),
    answer: z.union([z.string(), z.array(z.string())])
  }))
});

/**
 * @swagger
 * /surveys/{id}/respond:
 *   post:
 *     summary: Submit a survey response
 *     tags: [Surveys]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Survey ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: array
 *                           items:
 *                             type: string
 *           example:
 *             answers: [
 *               {
 *                 "question_id": 1,
 *                 "answer": "Samsung"
 *               },
 *               {
 *                 "question_id": 2,
 *                 "answer": ["Camera", "Battery"]
 *               },
 *               {
 *                 "question_id": 3,
 *                 "answer": "Approximately 4 hours daily"
 *               }
 *             ]
 *     responses:
 *       201:
 *         description: Response submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Response saved successfully"
 *                 points_earned:
 *                   type: integer
 *                   example: 100
 *       400:
 *         description: Invalid input or survey already completed
 *       404:
 *         description: Survey not found
 */

// Update validation middleware to use question_id consistently
const validateSurveyResponse = async (req, res, next) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Answers must be an array'
    });
  }

  for (const answer of answers) {
    if (!answer.question_id || answer.answer === undefined) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Each answer must include question_id and answer'
      });
    }

    if (!Number.isInteger(answer.question_id)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'question_id must be an integer'
      });
    }

    if (typeof answer.answer !== 'string' && !Array.isArray(answer.answer)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'answer must be a string or an array of strings'
      });
    }

    if (Array.isArray(answer.answer)) {
      if (!answer.answer.every(item => typeof item === 'string')) {
        return res.status(400).json({
          error: 'Invalid input',
          message: 'All multiple choice answers must be strings'
        });
      }
    }
  }

  next();
};

router.post('/:id/respond', auth, validateSurveyResponse, surveyController.submitResponse);

// Example survey data
const exampleSurveys = {
  title: "Technology and Mobile Devices",
  description: "Survey about smartphone and tablet usage",
  category: "Technology",
  points: 100,
  questions: [
    {
      text: "What smartphone brand do you currently use?",
      type: "single_choice",
      options: ["Apple", "Samsung", "Xiaomi", "Other"],
      required: true
    },
    {
      text: "What features do you consider most important in a smartphone?",
      type: "multiple_choice",
      options: ["Camera", "Battery", "Performance", "Price"],
      required: true
    }
  ]
};

// Example response format
const exampleResponse = {
  message: "Response saved successfully",
  points_earned: 100,
  survey_response: {
    id: 1,
    survey_id: 1,
    answers: [
      {
        question_id: 1,
        answer: "Samsung"
      },
      {
        question_id: 2,
        answer: ["Camera", "Battery"]
      }
    ],
    points_earned: 100,
    created_at: "2024-02-20T15:30:00.000Z"
  }
};

router.get('/responses', auth, surveyController.getUserResponses);

module.exports = router; 
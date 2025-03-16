const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const { Survey, Question, SurveyResponse } = require('../models');
const { sequelize } = require('../config/database');

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
router.get('/', auth, async (req, res) => {
  try {
    // Get user's completed surveys first
    const completedSurveys = await SurveyResponse.findAll({
      where: { user_id: req.user.id },
      attributes: ['survey_id']
    });

    const completedSurveyIds = completedSurveys.map(response => response.survey_id);

    // Then get available surveys
    const surveys = await Survey.findAll({
      order: [['created_at', 'DESC']]
    });

    // Filter out completed surveys
    const availableSurveys = surveys.filter(survey => !completedSurveyIds.includes(survey.id));

    res.json(availableSurveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ message: 'Error retrieving surveys' });
  }
});

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
router.get('/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findByPk(req.params.id, {
      include: [{
        model: Question,
        as: 'questions'
      }]
    });
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

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
router.post('/', auth, async (req, res) => {
  try {
    const validatedData = createSurveySchema.parse(req.body);
    const survey = await Survey.create(validatedData);
    res.status(201).json(survey);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid survey data', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

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

router.post('/:id/respond', auth, validateSurveyResponse, async (req, res) => {
  try {
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Check if user has already completed this survey
    const existingResponse = await SurveyResponse.findOne({
      where: {
        user_id: req.user.id,
        survey_id: survey.id
      }
    });

    if (existingResponse) {
      return res.status(400).json({ message: 'You have already completed this survey' });
    }

    // Create survey response with explicit field names
    const response = await SurveyResponse.create({
      user_id: req.user.id,
      survey_id: survey.id,
      answers: req.body.answers,
      points_earned: survey.points
    });

    // Update user points
    await req.user.increment('points', { by: survey.points });

    res.status(201).json({
      message: 'Response saved successfully',
      points_earned: survey.points
    });
  } catch (error) {
    console.error('Error submitting survey response:', error);
    res.status(500).json({ message: 'Error saving the response' });
  }
});

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

module.exports = router; 
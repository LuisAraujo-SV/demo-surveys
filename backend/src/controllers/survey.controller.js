const surveyService = require('../services/survey.service');
const { createSurveyDto, surveyResponseDto } = require('../dto/survey.dto');
const ApiError = require('../utils/ApiError');
const { catchAsync } = require('../utils/catchAsync');

class SurveyController {
  /**
   * @swagger
   * /surveys:
   *   get:
   *     summary: Get all surveys that haven't been responded to by the user
   *     tags: [Surveys]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: List of available surveys
   */
  getAllSurveys = catchAsync(async (req, res) => {
    const surveys = await surveyService.getAllSurveys(req.user.id);
    res.json(surveys);
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
   *     responses:
   *       200:
   *         description: Survey details
   *       404:
   *         description: Survey not found
   */
  getSurveyById = catchAsync(async (req, res) => {
    const survey = await surveyService.getSurveyById(req.params.id);
    res.json(survey);
  });

  /**
   * @swagger
   * /surveys:
   *   post:
   *     summary: Create a new survey
   *     tags: [Surveys]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateSurvey'
   *     responses:
   *       201:
   *         description: Survey created successfully
   *       400:
   *         description: Invalid input data
   */
  createSurvey = catchAsync(async (req, res) => {
    const validatedData = createSurveyDto.parse(req.body);
    const survey = await surveyService.createSurvey(validatedData);
    res.status(201).json(survey);
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SurveyResponse'
   *     responses:
   *       201:
   *         description: Response submitted successfully
   *       400:
   *         description: Invalid input or survey already completed
   *       404:
   *         description: Survey not found
   */
  submitResponse = catchAsync(async (req, res) => {
    const validatedData = surveyResponseDto.parse(req.body);
    const result = await surveyService.submitSurveyResponse(
      req.params.id,
      req.user.id,
      validatedData.answers
    );
    
    res.status(201).json({
      message: 'Response saved successfully',
      points_earned: result.pointsEarned
    });
  });

  /**
   * @swagger
   * /surveys/responses:
   *   get:
   *     summary: Get user's survey responses
   *     tags: [Surveys]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: List of user's survey responses
   */
  getUserResponses = catchAsync(async (req, res) => {
    const responses = await surveyService.getUserSurveyResponses(req.user.id);
    res.json(responses);
  });
}

module.exports = new SurveyController(); 
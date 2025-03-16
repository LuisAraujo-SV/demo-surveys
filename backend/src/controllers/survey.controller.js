const surveyService = require('../services/survey.service');
const { createSurveyDto, surveyResponseDto } = require('../dto/survey.dto');
const ApiError = require('../utils/ApiError');
const { catchAsync } = require('../utils/catchAsync');

class SurveyController {
  
  getAllSurveys = catchAsync(async (req, res) => {
    const surveys = await surveyService.getAllSurveys(req.user.id);
    res.json(surveys);
  });

  
  getSurveyById = catchAsync(async (req, res) => {
    const survey = await surveyService.getSurveyById(req.params.id);
    res.json(survey);
  });

  
  createSurvey = catchAsync(async (req, res) => {
    const validatedData = createSurveyDto.parse(req.body);
    const survey = await surveyService.createSurvey(validatedData);
    res.status(201).json(survey);
  });


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

  
  getUserResponses = catchAsync(async (req, res) => {
    const responses = await surveyService.getUserSurveyResponses(req.user.id);
    res.json(responses);
  });
}

module.exports = new SurveyController(); 
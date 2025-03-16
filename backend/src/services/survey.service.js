const { Survey, Question, SurveyResponse, User } = require('../models');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

class SurveyService {
  async createSurvey(surveyData) {
    const result = await sequelize.transaction(async (t) => {
      const survey = await Survey.create(surveyData, { transaction: t });
      
      if (surveyData.questions && surveyData.questions.length > 0) {
        const questions = surveyData.questions.map(q => ({
          ...q,
          survey_id: survey.id
        }));
        await Question.bulkCreate(questions, { transaction: t });
      }
      
      return survey;
    });

    return this.getSurveyById(result.id);
  }

  async getSurveyById(id) {
    const survey = await Survey.findByPk(id, {
      include: [{
        model: Question,
        as: 'questions'
      }]
    });

    if (!survey) {
      throw new ApiError(404, 'Survey not found');
    }

    return survey;
  }

  async getAllSurveys(userId) {
    // Get all surveys with their questions
    const surveys = await Survey.findAll({
      include: [
        {
          model: Question,
          as: 'questions'
        },
        {
          model: SurveyResponse,
          as: 'responses',
          where: { user_id: userId },
          required: false // LEFT JOIN to include surveys without responses
        }
      ],
      having: sequelize.literal('COUNT(responses.id) = 0'), // Update to use the alias
      group: ['responses.id', 'Survey.id', 'questions.id'], // Group by survey and question IDs
      order: [['created_at', 'DESC']] // Most recent surveys first
    });

    return surveys;
  }

  async submitSurveyResponse(surveyId, userId, answers) {
    const survey = await this.getSurveyById(surveyId);
    console.log(survey);
    
    // Check if user has already completed this survey
    const existingResponse = await SurveyResponse.findOne({
      where: {
        survey_id: surveyId,
        user_id: userId
      }
    });

    if (existingResponse) {
      throw new ApiError(400, 'You have already completed this survey');
    }

    // Validate that all questions are answered
    const surveyQuestionIds = survey.questions.map(q => q.id);
    const answerQuestionIds = answers.map(a => a.question_id);
    const hasAllAnswers = surveyQuestionIds.every(id => answerQuestionIds.includes(id));

    if (!hasAllAnswers) {
      throw new ApiError(400, 'All questions must be answered');
    }

    const result = await sequelize.transaction(async (t) => {
      // Create survey response with points_earned
      const response = await SurveyResponse.create({
        survey_id: surveyId,
        user_id: userId,
        answers: answers,
        points_earned: survey.points
      }, { transaction: t });

      // Award points to user
      await User.increment('points', {
        by: survey.points,
        where: { id: userId },
        transaction: t
      });

      return {
        response,
        pointsEarned: survey.pointsReward
      };
    });

    return result;
  }

  async getUserSurveyResponses(userId) {
    return SurveyResponse.findAll({
      where: { user_id: userId },
      include: [{
        model: Survey,
        include: [{
          model: Question,
          as: 'questions'
        }]
      }]
    });
  }
}

module.exports = new SurveyService(); 
const { Survey, Question, SurveyResponse, User } = require('../models');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

class SurveyService {
  async createSurvey(surveyData) {
    try {
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
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw ApiError.badRequest('Invalid survey data', error.errors);
      }
      throw ApiError.internal('Error creating survey');
    }
  }

  async getSurveyById(id) {
    const survey = await Survey.findByPk(id, {
      include: [{
        model: Question,
        as: 'questions'
      }]
    });

    if (!survey) {
      throw ApiError.notFound('Survey not found');
    }

    return survey;
  }

  async getAllSurveys(userId, category) {
    try {
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
            required: false
          }
        ],
        where: category ? { category } : {},
        having: sequelize.literal('COUNT(responses.id) = 0'),
        group: ['responses.id', 'Survey.id', 'questions.id'],
        order: [['created_at', 'DESC']]
      });

      return surveys;
    } catch (error) {
      console.log(error);
      throw ApiError.internal('Error fetching surveys');
    }
  }

  async submitSurveyResponse(surveyId, userId, answers) {
    const survey = await this.getSurveyById(surveyId);
    
    // Check if user has already completed this survey
    const existingResponse = await SurveyResponse.findOne({
      where: {
        survey_id: surveyId,
        user_id: userId
      }
    });

    if (existingResponse) {
      throw ApiError.badRequest('You have already completed this survey');
    }

    // Validate that all questions are answered
    const surveyQuestionIds = survey.questions.map(q => q.id);
    const answerQuestionIds = answers.map(a => a.question_id);
    const hasAllAnswers = surveyQuestionIds.every(id => answerQuestionIds.includes(id));

    if (!hasAllAnswers) {
      throw ApiError.badRequest('All questions must be answered');
    }

    try {
      const result = await sequelize.transaction(async (t) => {
        // Create survey response
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
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw ApiError.badRequest('Invalid response data', error.errors);
      }
      throw ApiError.internal('Error submitting survey response');
    }
  }

  async getUserSurveyResponses(userId) {
    try {
      const responses = await SurveyResponse.findAll({
        where: { user_id: userId },
        include: [{
          model: Survey,
          include: [{
            model: Question,
            as: 'questions'
          }]
        }],
        order: [['createdAt', 'DESC']]
      });

      return responses;
    } catch (error) {
      throw ApiError.internal('Error fetching survey responses');
    }
  }
}

module.exports = new SurveyService(); 
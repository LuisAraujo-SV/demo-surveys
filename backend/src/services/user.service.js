const bcrypt = require('bcryptjs');
const { User, Survey, SurveyResponse } = require('../models');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

class UserService {
  async updateProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw ApiError.notFound('User not found');
      }

      await user.update(updateData).catch((error) => {
        if (error.name === 'SequelizeValidationError') {
          throw ApiError.badRequest('Invalid profile data', error.errors);
        }
        throw error;
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        category: user.category,
        points: user.points
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw ApiError.internal('Error updating profile');
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw ApiError.notFound('User not found');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        throw ApiError.badRequest('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw ApiError.internal('Error changing password');
    }
  }

  async getUserStats(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw ApiError.notFound('User not found');
      }

      const completedSurveys = await SurveyResponse.count({
        where: { user_id: userId }
      });

      const totalPoints = user.points;

      const surveysByCategory = await SurveyResponse.findAll({
        attributes: [
          [sequelize.col('Survey.category'), 'category'],
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        include: [{
          model: Survey,
          attributes: []
        }],
        where: { user_id: userId },
        group: ['Survey.category'],
        raw: true
      });

      return {
        completedSurveys,
        totalPoints,
        surveysByCategory
      };
    } catch (error) {
      throw ApiError.internal('Error fetching user statistics');
    }
  }

  async getProfile(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw ApiError.notFound('User not found');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        category: user.category,
        points: user.points
      };
    } catch (error) {
      throw ApiError.internal('Error fetching user profile');
    }
  }

  async getSurveyHistory(userId) {
    try {
      const responses = await SurveyResponse.findAll({
        where: { user_id: userId },
        include: [{
          model: Survey, as: 'survey',
          attributes: ['id', 'title', 'category', 'points', 'description']
        }],
        order: [['created_at', 'DESC']],
        attributes: ['id', 'answers', 'points_earned', 'created_at']
      });

      return responses.map(response => ({
        id: response.id,
        survey: response.survey,
        answers: response.answers,
        points_earned: response.points_earned,
        created_at: response.createdAt
      }));
    } catch (error) {
      throw ApiError.internal('Error fetching survey history');
    }
  }
}

module.exports = new UserService(); 
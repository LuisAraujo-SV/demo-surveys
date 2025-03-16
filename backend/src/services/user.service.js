const bcrypt = require('bcryptjs');
const { User, Survey, SurveyResponse } = require('../models');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

class UserService {
  async updateProfile(userId, updateData) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await user.update(updateData);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      category: user.category,
      points: user.points
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return { message: 'Password updated successfully' };
  }

  async getUserStats(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
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
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      category: user.category,
      points: user.points
    };
  }

  async getSurveyHistory(userId) {
    const responses = await SurveyResponse.findAll({
      where: { user_id: userId },
      include: [{
        model: Survey, as: 'survey',
        attributes: ['id', 'title', 'category', 'points', 'description']
      }],
      order: [['created_at', 'DESC']], // Most recent responses first
      attributes: ['id', 'answers', 'points_earned', 'created_at']
    });

    if (!responses) {
      return [];
    }

    return responses.map(response => ({
      id: response.id,
      survey: response.survey,
      answers: response.answers,
      points_earned: response.points_earned,
      created_at: response.created_at
    }));
  }
}

module.exports = new UserService(); 
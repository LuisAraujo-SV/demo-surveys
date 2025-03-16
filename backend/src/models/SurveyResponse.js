const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SurveyResponse = sequelize.define('SurveyResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  survey_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'survey_id'
  },
  answers: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  points_earned: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'points_earned'
  }
}, {
  tableName: 'survey_response',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SurveyResponse; 
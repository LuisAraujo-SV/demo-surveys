const User = require('./User');
const Survey = require('./Survey');
const Question = require('./Question');
const SurveyResponse = require('./SurveyResponse');

// Define relationships with explicit field names
Survey.hasMany(Question, {
  foreignKey: { name: 'survey_id', field: 'survey_id' },
  as: 'questions',
  onDelete: 'CASCADE'
});

Question.belongsTo(Survey, {
  foreignKey: { name: 'survey_id', field: 'survey_id' },
  as: 'survey'
});

User.hasMany(SurveyResponse, {
  foreignKey: { name: 'user_id', field: 'user_id' },
  as: 'responses',
  onDelete: 'CASCADE'
});

SurveyResponse.belongsTo(User, {
  foreignKey: { name: 'user_id', field: 'user_id' },
  as: 'user'
});

Survey.hasMany(SurveyResponse, {
  foreignKey: { name: 'survey_id', field: 'survey_id' },
  as: 'responses',
  onDelete: 'CASCADE'
});

SurveyResponse.belongsTo(Survey, {
  foreignKey: { name: 'survey_id', field: 'survey_id' },
  as: 'survey'
});

module.exports = {
  User,
  Survey,
  Question,
  SurveyResponse
}; 
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  survey_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('text', 'single_choice', 'multiple_choice'),
    allowNull: false
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'question',
  underscored: true
});

module.exports = Question; 
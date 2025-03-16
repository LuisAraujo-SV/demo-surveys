const { sequelize, initializeSchema } = require('../config/database');
const { User, Survey, Question } = require('../models');

async function migrate() {
  try {
    // First, initialize schema
    await initializeSchema();
    console.log('Schema initialized.');

    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');


    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      category: 'Technology',
      points: 0
    });

    // Create example surveys with their questions
    const surveys = await Promise.all([
      Survey.create({
        title: 'Technology and Mobile Devices',
        description: 'Survey about smartphone and tablet usage',
        category: 'Technology',
        points: 100,
        questions: [
          {
            text: 'What smartphone brand do you currently use?',
            type: 'single_choice',
            options: ['Apple', 'Samsung', 'Xiaomi', 'Other'],
            required: true
          },
          {
            text: 'What features do you consider most important in a smartphone?',
            type: 'multiple_choice',
            options: ['Camera', 'Battery', 'Performance', 'Price'],
            required: true
          },
          {
            text: 'How much time do you spend daily using your smartphone?',
            type: 'text',
            required: true
          }
        ]
      }, {
        include: [{
          model: Question,
          as: 'questions'
        }]
      }),

      Survey.create({
        title: 'Sports Habits',
        description: 'Survey about physical activities and sports',
        category: 'Sports',
        points: 150,
        questions: [
          {
            text: 'What sports do you regularly practice?',
            type: 'multiple_choice',
            options: ['Football', 'Basketball', 'Running', 'Swimming'],
            required: true
          },
          {
            text: 'How many times per week do you exercise?',
            type: 'single_choice',
            options: ['1-2 times', '3-4 times', '5 or more times', 'I don\'t exercise'],
            required: true
          }
        ]
      }, {
        include: [{
          model: Question,
          as: 'questions'
        }]
      })
    ]);

    console.log('Migration completed successfully!');
    console.log('Admin credentials:', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log(`Created ${surveys.length} example surveys`);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('Migration process completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration process failed:', error);
    process.exit(1);
  }); 
const { sequelize, initializeSchema } = require('../config/database');
const { User, Survey, Question } = require('../models');
const bcrypt = require('bcryptjs');

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

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      category: 'Technology',
      points: 0
    });

    // Create example surveys with their questions
    const surveys = await Promise.all([  
      // Technology
      Survey.create({
        title: 'Artificial Intelligence Trends',
        description: 'Survey on the impact of AI in daily life',
        category: 'Technology',
        points: 100,
        questions: [
          {
            text: 'Which AI tools do you use regularly?',
            type: 'multiple_choice',
            options: ['ChatGPT', 'DALL·E', 'MidJourney', 'None'],
            required: true,
          },
          {
            text: 'Do you trust AI systems for decision-making?',
            type: 'single_choice',
            options: ['Yes', 'No', 'Depends on the context'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Cybersecurity Awareness',
        description: 'Survey on online security habits',
        category: 'Technology',
        points: 120,
        questions: [
          {
            text: 'How often do you change your passwords?',
            type: 'single_choice',
            options: ['Monthly', 'Every 6 months', 'Rarely'],
            required: true,
          },
          {
            text: 'Do you use two-factor authentication?',
            type: 'single_choice',
            options: ['Yes', 'No', 'Sometimes'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Cloud Computing Adoption',
        description: 'Survey on cloud platform usage',
        category: 'Technology',
        points: 150,
        questions: [
          {
            text: 'Which cloud platform do you use?',
            type: 'multiple_choice',
            options: ['AWS', 'Azure', 'GCP', 'Other'],
            required: true,
          },
          {
            text: 'Do you prefer cloud or on-premise solutions?',
            type: 'single_choice',
            options: ['Cloud', 'On-premise', 'Hybrid'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Blockchain Technology Adoption',
        description: 'Survey on the use of blockchain solutions',
        category: 'Technology',
        points: 130,
        questions: [
          {
            text: 'Do you invest in cryptocurrencies?',
            type: 'single_choice',
            options: ['Yes', 'No'],
            required: true,
          },
          {
            text: 'Which blockchain platform are you familiar with?',
            type: 'multiple_choice',
            options: ['Ethereum', 'Bitcoin', 'Solana', 'Polkadot'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      // Healthcare
      Survey.create({
        title: 'Mental Health Awareness',
        description: 'Survey on mental health habits and support',
        category: 'Healthcare',
        points: 100,
        questions: [
          {
            text: 'Do you prioritize mental health check-ups?',
            type: 'single_choice',
            options: ['Yes', 'No', 'Occasionally'],
            required: true,
          },
          {
            text: 'What relaxation techniques do you use?',
            type: 'multiple_choice',
            options: ['Meditation', 'Yoga', 'Exercise', 'Therapy'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Nutrition and Diet Habits',
        description: 'Survey on eating habits and dietary preferences',
        category: 'Healthcare',
        points: 120,
        questions: [
          {
            text: 'What type of diet do you follow?',
            type: 'single_choice',
            options: ['Vegetarian', 'Vegan', 'Keto', 'Balanced'],
            required: true,
          },
          {
            text: 'Do you track your calorie intake?',
            type: 'single_choice',
            options: ['Yes', 'No', 'Sometimes'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Fitness and Exercise Habits',
        description: 'Survey on physical activity levels',
        category: 'Healthcare',
        points: 130,
        questions: [
          {
            text: 'How many times do you exercise per week?',
            type: 'single_choice',
            options: ['1-2', '3-4', '5 or more', 'None'],
            required: true,
          },
          {
            text: 'What type of workout do you prefer?',
            type: 'multiple_choice',
            options: ['Cardio', 'Strength training', 'Yoga', 'Pilates'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Healthcare Access and Experience',
        description: 'Survey on hospital visits and medical care',
        category: 'Healthcare',
        points: 140,
        questions: [
          {
            text: 'How often do you visit the doctor for a check-up?',
            type: 'single_choice',
            options: ['Once a year', 'Twice a year', 'Rarely'],
            required: true,
          },
          {
            text: 'Do you have health insurance?',
            type: 'single_choice',
            options: ['Yes', 'No'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      // Education
      Survey.create({
        title: 'Online Learning Platforms',
        description: 'Survey on platforms like Coursera and Udemy',
        category: 'Education',
        points: 100,
        questions: [
          {
            text: 'Which platform do you prefer for learning?',
            type: 'multiple_choice',
            options: ['Udemy', 'Coursera', 'Khan Academy', 'Other'],
            required: true,
          },
          {
            text: 'Do you prefer video-based learning or reading materials?',
            type: 'single_choice',
            options: ['Video', 'Reading', 'Interactive exercises'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Preferred Learning Style',
        description: 'Survey on learning strategies and environments',
        category: 'Education',
        points: 120,
        questions: [
          {
            text: 'What is your preferred learning environment?',
            type: 'single_choice',
            options: ['Online', 'In-person', 'Hybrid'],
            required: true,
          },
          {
            text: 'Which subjects do you enjoy the most?',
            type: 'multiple_choice',
            options: ['Math', 'Science', 'Languages', 'History'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Financial Literacy',
        description: 'Survey on financial knowledge and skills',
        category: 'Finance',
        points: 150,
        questions: [
          {
            text: 'Do you invest in stocks or crypto?',
            type: 'single_choice',
            options: ['Yes', 'No'],
            required: true,
          },
          {
            text: 'How do you manage your personal budget?',
            type: 'multiple_choice',
            options: ['Manually', 'With an app', 'Hiring an advisor'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
      
      // Fashion
      Survey.create({
        title: 'Personal Style Preferences',
        description: 'Survey on clothing style and fashion choices',
        category: 'Fashion',
        points: 90,
        questions: [
          {
            text: 'What is your preferred clothing style?',
            type: 'single_choice',
            options: ['Casual', 'Formal', 'Streetwear', 'Vintage'],
            required: true,
          },
          {
            text: 'How often do you shop for clothes?',
            type: 'single_choice',
            options: ['Weekly', 'Monthly', 'Every few months', 'Rarely'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Sustainable Fashion Awareness',
        description: 'Survey on eco-friendly brands and practices',
        category: 'Fashion',
        points: 110,
        questions: [
          {
            text: 'Do you support sustainable brands?',
            type: 'single_choice',
            options: ['Yes', 'No', 'Sometimes'],
            required: true,
          },
          {
            text: 'Which sustainable materials do you prefer?',
            type: 'multiple_choice',
            options: ['Organic Cotton', 'Recycled Polyester', 'Bamboo', 'Hemp'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Influence of Fashion Trends',
        description: 'Survey on how social media impacts fashion choices',
        category: 'Fashion',
        points: 130,
        questions: [
          {
            text: 'Where do you get your fashion inspiration?',
            type: 'multiple_choice',
            options: ['Instagram', 'Pinterest', 'TikTok', 'Fashion Blogs'],
            required: true,
          },
          {
            text: 'Do you follow seasonal trends?',
            type: 'single_choice',
            options: ['Yes', 'No', 'Only for specific items'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Luxury Brand Preferences',
        description: 'Survey on luxury fashion brands',
        category: 'Fashion',
        points: 150,
        questions: [
          {
            text: 'Which luxury brand do you prefer?',
            type: 'single_choice',
            options: ['Gucci', 'Prada', 'Louis Vuitton', 'Chanel'],
            required: true,
          },
          {
            text: 'How often do you purchase luxury items?',
            type: 'single_choice',
            options: ['Rarely', 'Occasionally', 'Frequently'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      // Sports
      Survey.create({
        title: 'Fitness and Training Habits',
        description: 'Survey on workout routines',
        category: 'Sports',
        points: 110,
        questions: [
          {
            text: 'What type of exercise do you practice?',
            type: 'multiple_choice',
            options: ['Running', 'Yoga', 'Gym Training', 'Cycling'],
            required: true,
          },
          {
            text: 'How many times per week do you exercise?',
            type: 'single_choice',
            options: ['1-2', '3-4', '5 or more', 'None'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Favorite Sports to Watch',
        description: 'Survey on sports events and tournaments',
        category: 'Sports',
        points: 130,
        questions: [
          {
            text: 'Which sport do you enjoy watching the most?',
            type: 'single_choice',
            options: ['Football', 'Basketball', 'Tennis', 'Other'],
            required: true,
          },
          {
            text: 'How often do you attend live sports events?',
            type: 'single_choice',
            options: ['Monthly', 'Every few months', 'Rarely', 'Never'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Healthy Lifestyle and Sports',
        description: 'Survey on how sports improve physical health',
        category: 'Sports',
        points: 140,
        questions: [
          {
            text: 'How do you stay motivated to exercise?',
            type: 'text',
            required: true,
          },
          {
            text: 'Do you prefer individual or team sports?',
            type: 'single_choice',
            options: ['Individual', 'Team', 'Both'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Sports Equipment Preferences',
        description: 'Survey on preferred brands and gear',
        category: 'Sports',
        points: 150,
        questions: [
          {
            text: 'Which brand do you prefer for sportswear?',
            type: 'single_choice',
            options: ['Nike', 'Adidas', 'Under Armour', 'Other'],
            required: true,
          },
          {
            text: 'Do you invest in high-end sports equipment?',
            type: 'single_choice',
            options: ['Yes', 'No', 'Only for specific sports'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      // Entertainment
      Survey.create({
        title: 'Movie and TV Preferences',
        description: 'Survey on favorite movie genres and platforms',
        category: 'Entertainment',
        points: 100,
        questions: [
          {
            text: 'Which streaming platform do you use most?',
            type: 'single_choice',
            options: ['Netflix', 'HBO Max', 'Disney+', 'Amazon Prime'],
            required: true,
          },
          {
            text: 'What is your favorite movie genre?',
            type: 'multiple_choice',
            options: ['Action', 'Comedy', 'Drama', 'Horror'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Music Preferences',
        description: 'Survey on music genres and artists',
        category: 'Entertainment',
        points: 120,
        questions: [
          {
            text: 'Which genre do you listen to most?',
            type: 'single_choice',
            options: ['Pop', 'Rock', 'Hip Hop', 'Jazz'],
            required: true,
          },
          {
            text: 'Do you attend live concerts?',
            type: 'single_choice',
            options: ['Frequently', 'Occasionally', 'Rarely', 'Never'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      // Other
      Survey.create({
        title: 'General Lifestyle Survey',
        description: 'Survey on daily habits and routines',
        category: 'Other',
        points: 100,
        questions: [
          {
            text: 'How do you usually spend your weekends?',
            type: 'multiple_choice',
            options: ['Traveling', 'Relaxing at home', 'Outdoor activities', 'Socializing'],
            required: true,
          },
          {
            text: 'What is your favorite hobby?',
            type: 'text',
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
      Survey.create({
        title: 'Travel Habits',
        description: 'Survey on travel destinations and experiences',
        category: 'Other',
        points: 110,
        questions: [
          {
            text: 'Which type of destination do you prefer?',
            type: 'single_choice',
            options: ['Beach', 'Mountains', 'City', 'Countryside'],
            required: true,
          },
          {
            text: 'How often do you travel?',
            type: 'single_choice',
            options: ['Frequently', 'Occasionally', 'Rarely'],
            required: true,
          }
        ]
      }, { include: [{ model: Question, as: 'questions' }] }),
    
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
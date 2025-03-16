const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');
const appConfig = require('../config/app');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
      points: 0
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        category: user.category,
        points: user.points
      },
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    console.log(user);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('isPasswordValid');
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        category: user.category,
        points: user.points
      },
      token
    };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email
      },
      appConfig.jwtSecret,
      { expiresIn: appConfig.jwtExpiresIn }
    );
  }

  async getUserFromToken(token) {
    try {
      const decoded = jwt.verify(token, appConfig.jwtSecret);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      return user;
    } catch (error) {
      throw new ApiError(401, 'Invalid token');
    }
  }
}

module.exports = new AuthService(); 
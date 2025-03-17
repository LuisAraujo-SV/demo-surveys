const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const appConfig = require('../config/app');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw ApiError.badRequest('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
      points: 0
    }).catch((error) => {
      if (error.name === 'SequelizeValidationError') {
        throw ApiError.badRequest('Invalid user data', error.errors);
      }
      throw ApiError.internal('Error creating user');
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
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
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
    try {
      return jwt.sign(
        { 
          id: user.id,
          email: user.email,
          category: user.category,
          role: user.role
        },
        appConfig.jwtSecret,
        { expiresIn: appConfig.jwtExpiresIn }
      );
    } catch (error) {
      throw ApiError.internal('Error generating token');
    }
  }

  async getUserFromToken(token) {
    try {
      const decoded = jwt.verify(token, appConfig.jwtSecret);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw ApiError.unauthorized('User not found');
      }

      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw ApiError.unauthorized('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Token has expired');
      }
      throw ApiError.internal('Error verifying token');
    }
  }
}

module.exports = new AuthService(); 
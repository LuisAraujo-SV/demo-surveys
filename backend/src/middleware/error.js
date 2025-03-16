const { ZodError } = require('zod');
const { ValidationError } = require('sequelize');
const ApiError = require('../utils/ApiError');

const handleZodError = (err) => {
  const errors = err.errors.map((error) => ({
    path: error.path.join('.'),
    message: error.message
  }));
  return ApiError.badRequest('Validation error', errors);
};

const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map((error) => ({
    path: error.path,
    message: error.message
  }));
  return ApiError.badRequest('Validation error', errors);
};

const handleSequelizeUniqueConstraintError = (err) => {
  const errors = err.errors.map((error) => ({
    path: error.path,
    message: error.message
  }));
  return ApiError.badRequest('Duplicate field value', errors);
};

const handleJWTError = () =>
  ApiError.unauthorized('Invalid token');

const handleJWTExpiredError = () =>
  ApiError.unauthorized('Token has expired');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = err;

  // Handle specific error types
  if (err instanceof ZodError) error = handleZodError(err);
  if (err instanceof ValidationError) error = handleSequelizeValidationError(err);
  if (err.name === 'SequelizeUniqueConstraintError') error = handleSequelizeUniqueConstraintError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // If it's not an ApiError by this point, convert it to one
  if (!(error instanceof ApiError)) {
    error = ApiError.internal(
      process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : err.message
    );
  }

  // Send error response
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 
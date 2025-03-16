class ApiError extends Error {
  constructor(statusCode, message, errors = null, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, null, false);
  }
}

module.exports = ApiError; 
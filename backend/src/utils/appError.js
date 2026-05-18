class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function isAppError(error) {
  return error instanceof AppError;
}

module.exports = {
  AppError,
  isAppError,
};

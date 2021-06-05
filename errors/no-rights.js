// Ошибка со статусом 403

class RightsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = RightsError;

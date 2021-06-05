// Ошибка со статусом 409

class EmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = EmailError;

// Ошибка со статусом 400

class DataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = DataError;

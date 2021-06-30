const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const DataError = require("../errors/data-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");

const { NODE_ENV, JWT_SECRET } = process.env;

// Создает пользователя
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        .then((user) => res.send({
          data: {
            name: user.name,
            email: user.email,
          },
        }))
        .catch((err) => {
          if (err.name === "ValidationError") {
            const error = new DataError("Переданы некорректные данные");
            next(error);
          }
          if (err.name === "MongoError") {
            const error = new ConflictError("Пользователь с таким email уже существует");
            next(error);
          } else {
            next(err);
          }
        });
    });
};

// Авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "secret-key", { expiresIn: "7d" }) });
    })
    .catch((next));
};

// Возвращает информацию о пользователе
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id).orFail(() => {
    const error = new NotFoundError("Пользователь с таким id не найден");
    next(error);
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const error = new DataError("Неправильный формат _id");
        next(error);
      } else {
        next(err);
      }
    });
};

// Редактирование информации пользователя
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  if (name === undefined || email === undefined) {
    const error = new DataError("Переданы некорректные данные");
    next(error);
    return;
  }
  User.findByIdAndUpdate(req.user._id, { name, email },
    { new: true })
    .orFail(() => {
      const error = new NotFoundError("Пользователь с таким id не найден");
      next(error);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "MongoError") {
        const error = new ConflictError("Пользователь с таким email уже существует");
        next(error);
      } else {
        next(err);
      }
    });
};

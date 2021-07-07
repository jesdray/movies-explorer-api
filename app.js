require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { celebrate, Joi, errors } = require("celebrate");
const validator = require("validator");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const {
  updateProfile, getUser, login, createUser,
} = require("./controllers/users");
const { getMovies, createMovie, deleteMovie } = require("./controllers/movies");

const { NODE_ENV, MONGOOSE_LINK } = process.env;
const NotFoundError = require(("./errors/not-found-err"));

const { PORT = 3005 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === "production" ? MONGOOSE_LINK : "mongodb://localhost:27017/moviesdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(cors());

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.get("/users/me", auth, getUser);

app.patch("/users/me", auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

app.get("/movies", auth, getMovies);

app.post("/movies", auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message("Не валидная ссылка");
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message("Не валидная ссылка");
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message("Не валидная ссылка");
    }),
    movieId: Joi.number().required(),
  }),
}), createMovie);

app.delete("/movies/:id", auth, deleteMovie);

app.use((req, res, next) => {
  const error = new NotFoundError("Ресурс не найден");
  next(error);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? "На сервере произошла ошибка"
      : message,
  });

  next();
});

app.listen(PORT, () => {
});

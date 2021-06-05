/* eslint-disable no-unused-vars */
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const { celebrate, Joi, errors } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/moviesdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.post("/singin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post("/singup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use("/users", auth, require("./routes/users"));
app.use("/movies", auth, require("./routes/movies"));

app.use(errorLogger);

app.use((req, res) => {
  res.status(404).send({ message: "Ресурс не найден" });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? "На сервере произошла ошибка"
      : message,
  });
});

app.listen(PORT, () => {
});

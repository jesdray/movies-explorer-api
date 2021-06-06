require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const { NODE_ENV, MONGOOSE_link } = process.env;
const NotFoundError = require(("./errors/not-found-err"))

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(NODE_ENV === "production" ? MONGOOSE_link : "mongodb://localhost:27017/moviesdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use("/", require("./routes/users"));
app.use("/", require("./routes/movies"));

app.use((req, res, next) => {
  const error = new NotFoundError("Ресурс не найден")
  next(error)
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
});

app.listen(PORT, () => {
});

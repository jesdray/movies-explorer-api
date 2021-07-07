require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { NODE_ENV, MONGOOSE_LINK } = process.env;
const NotFoundError = require(("./errors/not-found-err"));

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://movies-f.students.nomoredomains.club",
}));

mongoose.connect(NODE_ENV === "production" ? MONGOOSE_LINK : "mongodb://localhost:27017/moviesdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

// app.use((req, res, next) => {
//   const { method } = req;
//   const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
//   const requestHeaders = req.headers["access-control-request-headers"];

//   if (method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
//     res.header("Access-Control-Allow-Headers", requestHeaders);
//   }
//   res.header("Access-Control-Allow-Origin", "*");

//   next();
// });

app.use("/", require("./routes/index"));

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

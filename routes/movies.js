const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const { getMovies, createMovie, deleteMovie } = require("../controllers/movies");
const auth = require("../middlewares/auth");

router.get("/", auth, getMovies);

router.post("/", auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().min(2).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message("Не валидная ссылка");
    }),
    trailer: Joi.string().required().min(2).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message("Не валидная ссылка");
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message("Не валидная ссылка");
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete("/:id", auth, deleteMovie);

module.exports = router;

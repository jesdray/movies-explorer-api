const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getMovies, createMovie, deleteMovie } = require("../controllers/movies");

router.get("/", getMovies);
router.post("/", celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().min(2),
    trailer: Joi.string().required().min(2),
    thumbnail: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete("/:id", deleteMovie);

module.exports = router;

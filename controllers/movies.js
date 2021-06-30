const Movies = require("../models/movie");
const DataError = require("../errors/data-err");
const NotFoundError = require("../errors/not-found-err");
const RightsError = require("../errors/no-rights");

// Выдает все фильмы пользователя
module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(next);
};

// Создает фильм пользователя
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user,
  })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new DataError("Переданы некорректные данные");
        next(error);
      } else {
        next(err);
      }
    });
};

// Удаляет фильм пользователя по id
module.exports.deleteMovie = (req, res, next) => {
  Movies.findOne({ movieId: req.params.id }).orFail(() => {
    const error = new NotFoundError("Фильм с указанным id не найден");
    next(error);
  })
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        return Movies.findOneAndRemove({ movieId: req.params.id })
          .then((item) => {
            res.send({ data: item });
          });
      }
      throw new RightsError("У вас недостаточно прав для удаления");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const error = new DataError("Неправильный формат id");
        next(error);
      } else {
        next(err);
      }
    });
};

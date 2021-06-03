const Movies = require("../models/movie")


module.exports.getMovies = (req, res, next) => {
    Movies.find({})
        .then((movies) => {
            res.status(200).send({ data: movies })
        })
        .catch(next)
}

module.exports.createMovie = (req, res, next) => {
    const {
        country, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId
    } = req.body;

    Movies.create({ country, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId })
        .then((movie) => {
            res.status(200).send({ data: movie })
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                const error = new DataError("Переданы некорректные данные");
                next(error);
            }
            next(err);
        });
}

module.exports.deleteMovie = (req, res, next) => {
    Movies.findById(req.params.id).orFail(() => {
        const error = new NotFoundError("Фильм с указанным id не найден");
        next(error);
    })
        .then((movie) => {
            if (req.user._id == movie.owner) {
                Movies.findByIdAndRemove(req.params.id)
                    .then((item) => {
                        res.status(200).send({ data: item })
                    })
                    .catch((err) => {
                        if (err.name === "CastError") {
                            const error = new DataError("Неправильный формат _id");
                            next(error);
                        }
                        next(err);
                    });
            } else {
                throw new RightsError("У вас недостаточно прав для удаления");
            }
        })
        .catch((err) => {
            if (err.name === "CastError") {
                const error = new DataError("Неправильный формат _id");
                next(error);
            }
            next(err);
        });
}
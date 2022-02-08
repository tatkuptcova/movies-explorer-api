const Movie = require('../models/movie');

const BadRequestError = require('../errors/badRequest'); // 400
const ForbiddenError = require('../errors/forbiddenErr'); // 403
const NotFoundError = require('../errors/notFoundError'); // 404

module.exports.getMovie = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.find({ owner: ownerId })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

module.exports.removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((movie) => {
      const movieOwner = movie.owner.toString();
      if (movieOwner !== req.user._id) {
        next(new ForbiddenError('Нельзя удалить карточку другого пользователя'));
      } else {
        Movie.findByIdAndRemove(req.params.movieId).then(() => {
          res.status(200).send({ message: 'Карточка удалена' });
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id'));
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

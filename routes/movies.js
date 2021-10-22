const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const errorMessages = require('../errors/errorMessages');

const { getMovie, createMovie, removeMovie } = require('../controllers/movies');

const movieScheme = {
  string: Joi.string().required().messages(errorMessages.string),
  number: Joi.number().required().min(1).messages(errorMessages.number),
};

router.get('/', getMovie);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: movieScheme.string,
    director: movieScheme.string,
    duration: movieScheme.number,
    year: movieScheme.string,
    description: movieScheme.string,
    image: movieScheme.string,
    trailer: movieScheme.string,
    thumbnail: movieScheme.string,
    movieId: movieScheme.number,
    nameRU: movieScheme.string,
    nameEN: movieScheme.string,
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object({
    id: Joi.number().integer().messages({
      'any.rquired': 'Не указано поле {#label}',
      'number.empty': 'Поле {#label} не содержит информацию',
      'number.base': 'Поле {#label} должно иметь тип number',
    }),
  }),
}), removeMovie);

module.exports = router;

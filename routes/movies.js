const router = require('express').Router();

const { getMovie, createMovie, removeMovie } = require('../controllers/movies');

router.get('/', getMovie);
router.post('/', createMovie);
router.delete('/:movieId', removeMovie);

module.exports = router;

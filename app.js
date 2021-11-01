require('dotenv').config();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

const express = require('express');
const mongoose = require('mongoose');

const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const limit = require('./utils/rateLimiter');
const routes = require('./routes/index');

const { port = 3000 } = process.env;

const app = express();

app.use(requestLogger);

mongoose.connect(
  'mongodb://localhost:27017/moviesdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
  },
);

app.use(helmet());
app.use(limit);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errors);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

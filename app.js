require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const ErrorsAll = require('./middlewares/error');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const limit = require('./utils/rateLimiter');
const routes = require('./routes/index');

const {
  port = 3000,
  dbUrl = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

mongoose.connect(
  dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
).catch((err) => {
  console.log(err);
});

app.use(cors({
  origin: ['https://domainname.tatkuptsova.nomoredomains.club', 'http://domainname.tatkuptsova.nomoredomains.club', 'http://localhost:3000', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use(helmet());
app.use(requestLogger);
app.use(limit);
app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(ErrorsAll);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

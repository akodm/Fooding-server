require("dotenv").config();
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const helmet = require("helmet");
const cors = require("cors");

const { CLIENT_URL } = process.env;

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let boardRouter = require('./routes/board');
let roomRouter = require('./routes/room');
let messageRouter = require('./routes/message');
let socketRouter = require('./routes/socket');
let filterRouter = require('./routes/filter');

let app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const corsOption = {
  origin : CLIENT_URL,
  optionsSuccessStatus : 200
};

app.use(cors(corsOption));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);
app.use('/room', roomRouter);
app.use('/message', messageRouter);
app.use('/socket', socketRouter);
app.use('/filter', filterRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  if(err.message === "expireAll") {
    res.send("expireAll");
  } else {
    console.log(err);
    res.send("err");
  }
});

module.exports = app;

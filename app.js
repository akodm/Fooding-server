require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require("helmet");
const cors = require("cors");

const { CLIENT_URL } = process.env;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');
var roomRouter = require('./routes/room');
var messageRouter = require('./routes/message');

var app = express();

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

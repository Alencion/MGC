var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
//var asyncc = require('async');
//var crypto = require('crypto');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/authorization');
var userRouter = require('./routes/userview');
var boardRouter = require('./routes/board');
var articleRouter = require('./routes/article');

var passportConfig = require('./passport');

var sequelize = require('./models').sequelize;


require('dotenv').config();

var app = express();

sequelize.sync();

passportConfig(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave : false,
  saveUninitialized : false,
  secret : process.env.COOKIE_SECRET,
  cookie : {
    httpOnly:true,
    secure:false,
  },
}))

app.use(flash());
//use passport module
app.use(passport.initialize());
app.use(passport.session());



// router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/mypage', userRouter);
app.use('/board', boardRouter);
app.use('/article', articleRouter);
app.use('/authorization',authRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

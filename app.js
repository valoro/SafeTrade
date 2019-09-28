const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const createError = require('http-errors');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');

const dbConnector = require('./utils/dbConnector');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

mongoose
  .connect(dbConnector.uri, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => {
    console.log('- Connected successfully to database');

    // Middlewares
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(passport.initialize());
    app.use(passport.session());
    require('./utils/passport')(passport);

    // Routes
    app.use('/', indexRouter);
    app.use(passport.authenticate('jwt', { session: false }));
    app.use('/user', userRouter);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      next(createError(404));
    });

    // error handler
    app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.send('error');
    });
  })
  .catch(err => console.log('- Error while connecting to the database', err));

module.exports = app;

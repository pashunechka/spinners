const express = require('express');
const session = require('express-session');
const upload = require('express-fileupload');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
//mongoose.connect('mongodb://127.0.0.1:27017/Spinners');

mongoose.connect('mongodb://spinner:spinner123@ds225028.mlab.com:25028/spinners');
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
const index = require('./index');

const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Lqwoetpxmcdusglewe'));
app.use(session({
    secret: 'Lqwoetpxmcdusglewe',
    saveUninitialized: true,
    resave: true,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        expires: cookieExpirationDate,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join('./front/dist')));
app.use(upload());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/', index);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;

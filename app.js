var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var views = require('./routes/views');
var api = require('./routes/api');
var mongo = require('mongodb');
var app = express();
// var passport = require('passport');
var session = require('express-session');
// var configDB = require('./config/database.js');
var flash    = require('connect-flash');
var logout = require('express-passport-logout');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// required for passport
app.use(session({ secret: 'iwebfpiuwabiubgiuerg' })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.storeddata = {};

// Pass the access level to our Jade templates
app.use(function(req,res,next) {
  res.storeddata = app.storeddata; // Make the stored data object available in the res object to our routes
  res.locals.user = req.user;
  next();
});


// mongoose.connect(configDB.url);
// mongoose.connection.on('error', function(err){
//   if (err)
//     console.log(err);
// });

// require('./config/passport.js')(passport); // pass passport for configuration

// Route Parameters
app.param('resource_id', api.handleResourceId);

// Render Views
app.get('/', views.index);
app.get('/login', views.renderLogin);
app.get('/configure', views.renderConfigure);
app.get('/dashboard', views.renderDashboard);
app.get('/resource/:resource_id', views.renderResource);

app.post('/api/crawl', api.crawlDomain);
// API
// app.post('/api/register', passport.authenticate('local-signup', {
//         successRedirect : '/dashboard', // redirect to the dashboard
//         failureRedirect : '/register', // redirect back to the register page if there is an error
//         failureFlash : true // allow flash messages
// }));
// app.post('/api/login', passport.authenticate('local-login', {
//         successRedirect : '/dashboard', // redirect to the dashboard
//         failureRedirect : '/login', // redirect back to the login page if there is an error
//         failureFlash : true // allow flash messages
// }));

// middleware to ensure the user is authenticated. If not, redirect to login page.
// function isLoggedIn(req, res, next) {
//   if(req.isAuthenticated())
//     return next();
//   else
//     res.redirect('/login');
// }

// // middleware to redirect the user to the dashboard if they already logged in
// function isNotLoggedIn(req, res, next) {
//   if(req.isAuthenticated())
//     res.redirect('/dashboard');
//   else
//     return next();
// }

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

var express = require('express');
var router = express.Router();
var User = require('../models/user')

// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' });
});

// GET /register
router.get('/register', (req, res, next) => {
  return res.render('register', { title: 'Sign Up' });
});

// GET /profile
router.get('/profile', (req, res, next) => {
  if (!req.session.userId) {
    var err = new Error('You are not authorized to view this page.');
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
    .exec((error, user) => {
      if (error) {
        return next(error);
      } else {
        return res.render('/profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook});
      }
    });
}); 

// POST /register
router.post('/register', (req, res, next) => {
    if (req.body.email &&
         req.body.name &&
          req.body.favoriteBook &&
           req.body.password &&
            req.body.confirmPassword) {
        // confim matching password
        if (req.body.password !== req.body.confirmPassword) {
            var err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        }

        let userData = {
          email: req.body.email,
          name: req.body.name,
          favoriteBook: req.body.favoriteBook,
          password: req.body.password
        };

        User.create(userData, (error, user) => {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
          }
        });

    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

// GET /login
router.get('/login', (req, res, next) => {
  return res.render('login', {title: 'Log In'});
}); 

// POST /login
router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    res.status = 400;
    next(err);
  }
});

module.exports = router;

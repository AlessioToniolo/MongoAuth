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

// POST /register
router.post('/register', (req, res, next) => {
    if (req.body.email &&
         req.body.name &&
          req.body.favoriteBook &&
           req.body.password &&
            req.body.confirmPassword) {

    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

module.exports = router;

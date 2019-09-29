// REQUIRES

const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

// INDEX ROUTES

router.get('/', (req, res) => {
  res.render('landing');
});

// AUTH ROUTES

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const registeringUser = new User({ username: req.body.username });
  User.register(registeringUser, req.body.password, (createErr, createdUser) => {
    if (createErr) {
      res.redirect('/register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  (req, res) => {},
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;

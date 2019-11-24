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
      req.flash('error', createErr.message);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Thanks for joining us! Welcome, ${createdUser.username}`);
        res.redirect('/campgrounds');
      });
    }
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
    failureFlash: true,
    successFlash: 'Succesfully logged in',
  }),
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Succesfully logged out');
  res.redirect('/campgrounds');
});

module.exports = router;

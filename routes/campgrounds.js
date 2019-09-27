// REQUIRES

const express = require('express');

const router = express.Router();

const Campground = require('../models/campground');

// MIDDLEWARE

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// CAMPGROUND ROUTES

router.get('/', (req, res) => {
  Campground.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: result });
    }
  });
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Campground.findById(id)
    .populate('comments')
    .exec((err, result) => {
      res.render('campgrounds/show', { campground: result });
    });
});

router.post('/', isLoggedIn, (req, res) => {
  const author = {
    id: req.user._id,
    username: req.user.username,
  }
  Campground.create(req.body.campground, (createErr, createdCampground) => {
    if (createErr) {
      console.log(createErr);
    } else {
      createdCampground.author = author;
      createdCampground.save();
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;

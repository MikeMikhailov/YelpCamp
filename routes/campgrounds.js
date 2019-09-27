// REQUIRES

const express = require('express');

const router = express.Router();

const Campground = require('../models/campground');

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

router.get('/new', (req, res) => {
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

router.post('/', (req, res) => {
  Campground.create(req.body.campground, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;

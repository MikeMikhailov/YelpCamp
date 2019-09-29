// REQUIRES

const express = require('express');

const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

const router = express.Router();

// CAMPGROUND ROUTES

router.get('/', (req, res) => {
  Campground.find({}, (campgroundsFindErr, foundCampgrounds) => {
    if (campgroundsFindErr) {
      req.flash('error', 'Something went wrong');
      res.render('campgrounds/index', { campgrounds: [] });
    } else {
      res.render('campgrounds/index', { campgrounds: foundCampgrounds });
    }
  });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((campgroundFindErr, foundCampground) => {
      if (campgroundFindErr || !foundCampground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
      } else {
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

router.get('/:id/edit', middleware.isCampgroundOwner, (req, res) => {
  Campground.findById(req.params.id, (campgroundFindErr, foundCampground) => {
    if (campgroundFindErr) {
      req.flash('error', 'Something went wrong');
      res.redirect('/campgrounds');
    } else {
      res.render('campgrounds/edit', { campground: foundCampground });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  Campground.create(req.body.campground, (campgroundCreateErr, createdCampground) => {
    if (campgroundCreateErr) {
      req.flash('error', 'Couldn`t create campground');
      res.redirect('/campgrounds');
    } else {
      createdCampground.author = author;
      createdCampground.save();
      req.flash('success', 'Successfully created campground');
      res.redirect(`/campgrounds/${createdCampground._id}`);
    }
  });
});

router.put('/:id', middleware.isCampgroundOwner, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (campgroundUpdateErr, updatedCampground) => {
      if (campgroundUpdateErr) {
        req.flash('error', 'Couldn`t update campground');
        res.redirect(`/campgrounds/${req.params.id}/edit`);
      } else {
        req.flash('success', 'Successfully updated campground');
      }
      res.redirect(`/campgrounds/${req.params.id}`);
    },
  );
});

router.delete('/:id', middleware.isCampgroundOwner, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (campgroundDeleteErr, deletedCampground) => {
    if (campgroundDeleteErr) {
      req.flash('error', 'Couldn`t delete campground');
      res.redirect(`/campgrounds/${req.params.id}`);
    } else {
      Comment.deleteMany(
        { _id: { $in: deletedCampground.comments } },
        (commentsDeleteErr, deletedComments) => {
          if (commentsDeleteErr) {
            req.flash('error', 'Couldn`t delete comments with the campground');
          } else {
            req.flash('success', 'Successfully deleted campground');
          }
          res.redirect('/campgrounds');
        },
      );
    }
  });
});

module.exports = router;

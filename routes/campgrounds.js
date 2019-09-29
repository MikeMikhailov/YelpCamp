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
      console.log(campgroundsFindErr);
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
      res.render('campgrounds/show', { campground: foundCampground });
    });
});

router.get('/:id/edit', middleware.isCampgroundOwner, (req, res) => {
  Campground.findById(req.params.id, (campgroundFindErr, foundCampground) => {
    if (campgroundFindErr) {
      console.log(campgroundFindErr);
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
      console.log(campgroundCreateErr);
    } else {
      createdCampground.author = author;
      createdCampground.save();
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
        res.redirect('/campgrounds');
      } else {
        res.redirect(`/campgrounds/${updatedCampground._id}`);
      }
    },
  );
});

router.delete('/:id', middleware.isCampgroundOwner, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (campgroundDeleteErr, deletedCampground) => {
    if (campgroundDeleteErr) {
      res.redirect(`/campgrounds/${req.params.id}`);
    } else {
      Comment.deleteMany(
        { _id: { $in: deletedCampground.comments } },
        (commentsDeleteErr, deletedComments) => {
          if (commentsDeleteErr) {
            console.log(commentsDeleteErr);
          }
          res.redirect('/campgrounds');
        },
      );
    }
  });
});

module.exports = router;

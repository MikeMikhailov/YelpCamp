// REQUIRES

const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// MIDDLEWARE

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// COMMENTS ROUTES

router.get('/new', isLoggedIn, (req, res) => {
  const { id } = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

router.post('/', isLoggedIn, (req, res) => {
  const { id } = req.params;
  Campground.findById(id, (campgroundFindErr, campground) => {
    if (campgroundFindErr) {
      console.log(campgroundFindErr);
    } else {
      Comment.create(req.body.comment, (addCommentErr, comment) => {
        if (addCommentErr) {
          console.log(addCommentErr);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment)
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

module.exports = router;

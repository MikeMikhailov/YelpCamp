// REQUIRES

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// MIDDLEWARE

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'Please Log In');
    res.redirect('/login');
  }
}

function isCommentOwner(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (commentFindErr, foundComment) => {
      if (commentFindErr || !foundComment) {
        req.flash('error', 'Comment not found');
        res.redirect(`/campgrounds/${req.params.id}`);
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('warning', 'You are not authorised to do that');
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      }
    });
  } else {
    req.flash('error', 'Please Log In');
    res.redirect('/login');
  }
}

function isCampgroundOwner(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (campgroundFindErr, foundCampground) => {
      if (campgroundFindErr || !foundCampground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('warning', 'You are not authorised to do that');
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      }
    });
  } else {
    req.flash('error', 'Please Log In');
    res.redirect('/login');
  }
}

const middleware = { isLoggedIn, isCommentOwner, isCampgroundOwner };

module.exports = middleware;

// REQUIRES

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// MIDDLEWARE

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function isCommentOwner(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (commentFindErr, foundComment) => {
      if (commentFindErr) {
        console.log(commentFindErr);
      }
      if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
}

function isCampgroundOwner(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (campgroundFindErr, foundCampground) => {
      if (campgroundFindErr) {
        res.redirect('back');
      }
      if (foundCampground.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
}

const middleware = { isLoggedIn, isCommentOwner, isCampgroundOwner };

module.exports = middleware;

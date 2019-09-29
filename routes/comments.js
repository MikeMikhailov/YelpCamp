// REQUIRES

const express = require('express');

const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

const router = express.Router({ mergeParams: true });

// COMMENTS ROUTES

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (campgroundFindErr, foundCampground) => {
    if (campgroundFindErr) {
      console.log(campgroundFindErr);
    } else {
      res.render('comments/new', { campground: foundCampground });
    }
  });
});

router.get('/:comment_id/edit', middleware.isCommentOwner, (req, res) => {
  Campground.findById(req.params.id, (campgroundFindErr, foundCampground) => {
    if (campgroundFindErr) {
      console.log(campgroundFindErr);
    } else {
      Comment.findById(req.params.comment_id, (commentFindErr, foundComment) => {
        if (commentFindErr) {
          console.log(commentFindErr);
        } else {
          const campgroundSimplified = {
            id: foundCampground._id,
            name: foundCampground.name,
          };
          res.render('comments/edit', { campground: campgroundSimplified, comment: foundComment });
        }
      });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  const { id } = req.params;
  Campground.findById(id, (campgroundFindErr, foundCampground) => {
    if (campgroundFindErr) {
      console.log(campgroundFindErr);
    } else {
      Comment.create(req.body.comment, (commentCreateErr, createdComment) => {
        if (commentCreateErr) {
          console.log(commentCreateErr);
        } else {
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          createdComment.save();
          foundCampground.comments.push(createdComment);
          foundCampground.save();
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      });
    }
  });
});

router.put('/:comment_id', middleware.isCommentOwner, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (commentUpdateErr, updatedComment) => {
      if (commentUpdateErr) {
        res.redirect(`/${req.params.comment_id}/edit`);
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    },
  );
});

router.delete('/:comment_id', middleware.isCommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (commentDeleteErr, deletedComment) => {
    if (commentDeleteErr) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;

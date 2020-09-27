/* eslint-disable no-unused-vars */
// REQUIRES

const express = require('express');

const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

const router = express.Router({ mergeParams: true });

// COMMENTS ROUTES

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (campgroundFindErr, foundCampground) => {
    if (campgroundFindErr || !foundCampground) {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    } else {
      res.render('comments/new', { campground: foundCampground });
    }
  });
});

router.get('/:comment_id/edit', middleware.isCommentOwner, (req, res) => {
  Campground.findById(req.params.id, (campgroundFindErr, foundCampground) => {
    if (campgroundFindErr || !foundCampground) {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    } else {
      Comment.findById(req.params.comment_id, (commentFindErr, foundComment) => {
        if (commentFindErr) {
          req.flash('error', 'Something went wrong');
          res.redirect(`/campgrounds/${req.params.id}`);
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
    if (campgroundFindErr || !foundCampground) {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    } else {
      req.body.comment.text = req.body.comment.text.replace(/(\r\n|\n|\r)/gm, '');
      Comment.create(req.body.comment, (commentCreateErr, createdComment) => {
        if (commentCreateErr) {
          req.flash('error', 'Couldn`t create comment');
        } else {
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          createdComment.save();
          foundCampground.comments.push(createdComment);
          foundCampground.save();
          req.flash('success', 'Successfully created comment');
        }
        res.redirect(`/campgrounds/${req.params.id}`);
      });
    }
  });
});

router.put('/:comment_id', middleware.isCommentOwner, (req, res) => {
  req.body.comment.text = req.body.comment.text.replace(/(\r\n|\n|\r)/gm, '');
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (commentUpdateErr, updatedComment) => {
      if (commentUpdateErr) {
        req.flash('error', 'Couldn`t update comment');
        res.redirect(`/${req.params.comment_id}/edit`);
      } else {
        req.flash('success', 'Successfully updated comment');
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    },
  );
});

router.delete('/:comment_id', middleware.isCommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (commentDeleteErr, deletedComment) => {
    if (commentDeleteErr) {
      req.flash('error', 'Couldn`t delete comments');
    } else {
      req.flash('success', 'Successfully deleted comment');
    }
    res.redirect(`/campgrounds/${req.params.id}`);
  });
});

module.exports = router;

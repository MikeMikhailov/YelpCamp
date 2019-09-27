const express = require('express');

const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds.js');

// MONGODB SETUP

mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// EXPRESS SETUP

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');

seedDB();

// ROUTING

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: result });
    }
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', (req, res) => {
  const { id } = req.params;
  Campground.findById(id)
    .populate('comments')
    .exec((err, result) => {
      res.render('campgrounds/show', { campground: result });
    });
});

app.get('/campgrounds/:id/comments/new', (req, res) => {
  const { id } = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

app.post('/campgrounds', (req, res) => {
  Campground.create(req.body.campground, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
  const { id } = req.params;
  Campground.findById(id, (campgroundFindErr, campground) => {
    if (campgroundFindErr) {
      console.log(campgroundFindErr);
    } else {
      Comment.create(req.body.comment, (addCommentErr, comment) => {
        if (addCommentErr) {
          console.log(addCommentErr);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

app.listen(80, () => {
  console.log('Listening on 80');
});

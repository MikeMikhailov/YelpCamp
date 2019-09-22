const express = require('express');

const app = express();

const bodyparser = require('body-parser');

const mongoose = require('mongoose');

// MONGODB SETUP

mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// MONGOOSE MODELS

const campgroundSchema = new mongoose.Schema({
  name: String,
  img: String,
  description: String,
});

const campgroundModel = mongoose.model('Campground', campgroundSchema);

// EXPRESS SETUP

app.use(bodyparser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// ROUTING

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  campgroundModel.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds: result });
    }
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.get('/campgrounds/:id', (req, res) => {
  const { id } = req.params;
  campgroundModel.findById(id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { campground: result });
    }
  });
});

app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { img } = req.body;
  const { description } = req.body;
  const newCampground = { name, img, description };
  campgroundModel.create(newCampground, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

app.listen(80, () => {
  console.log('Listening on 80');
});

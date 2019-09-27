// REQUIRES

const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const seedDB = require('./seeds.js');

const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

const app = express();

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

// PASSPORT SETUP

app.use(
  expressSession({
    secret:
      'CJvGwWXcQzBAlaVj5Ym1LcbHFxQwum4OyAbKsnojRfqvv3uNUBi5x5Tq8pSnuuZgtbKg' +
      'jo3iu7Iar7xKfE3hJ0J41pes28MPGAVR5mLWdfVXnj5bZtsA96GEStoYwO68UE8nRsAn6F4WX8q8' +
      'PCYZpC7tL0c1PnKtUnUNXHXeDX1UYILnGOLTplxE68U7NEIGbkjvZtR',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// ROUTING

//   CAMPGROUND ROUTES

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

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

//   AUTH ROUTES

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const registeringUser = new User({ username: req.body.username });
  User.register(registeringUser, req.body.password, (createErr, createdUser) => {
    if (createErr) {
      res.redirect('/register');
      return;
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  (req, res) => {},
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

app.listen(80, () => {
  console.log('Listening on 80');
});

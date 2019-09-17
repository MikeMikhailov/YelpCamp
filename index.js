const express = require('express');

const app = express();

const bodyparser = require('body-parser');

const campgrounds = [
  {
    name: 'Salmon Creek',
    img: 'https://unsplash.com/photos/DgSnapS1itA/download?force=true',
  },
  {
    name: 'Granite Hill',
    img: 'https://unsplash.com/photos/pSaEMIiUO84/download?force=true',
  },
  {
    name: 'Mountain Goat`s Rest',
    img: 'https://unsplash.com/photos/ebnlHkqfUHY/download?force=true',
  },
];

app.use(bodyparser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { img } = req.body;
  const newCampground = { name, img };
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});

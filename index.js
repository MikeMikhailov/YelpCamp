const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  let campgrounds = [
    {
      name: 'Salmon Creek',
      img: 'https://unsplash.com/photos/8f_VQ3EFbTg/download?force=true',
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
  res.render('campgrounds')
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});

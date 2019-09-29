const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
  name: String,
  img: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'Comment',
    },
  ],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'User',
    },
    username: String,
  },
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;

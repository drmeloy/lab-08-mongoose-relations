const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  recipeId: {
    type: Number,
    required: true
  },
  dateOfAttempt: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

module.exports = mongoose.model('Attempt', schema);


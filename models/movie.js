const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    match: [/https?:\/\/(www\.)?[\w\-.~:/?#[\]@!$&'()*+,;=]*/g],
  },
  trailer: {
    type: String,
    required: true,
    match: [/https?:\/\/(www\.)?[\w\-.~:/?#[\]@!$&'()*+,;=]*/g],
  },
  thumbnail: {
    type: String,
    required: true,
    match: [/https?:\/\/(www\.)?[\w\-.~:/?#[\]@!$&'()*+,;=]*/g],
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  movieId: {
    type: String,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model("movie", movieSchema);

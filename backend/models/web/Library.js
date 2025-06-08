const mongoose=require('mongoose');

const libSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    maxLength: 50,
  },
  author: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isbn: {
    type: Number,
    required: true,
    unique: true,
  },
  isbnLong: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default:'Available',
  },
});
module.exports = mongoose.model("Library", libSchema);
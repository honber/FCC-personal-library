'use strict'

const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  comments: Array
})

const bookModel = mongoose.model('personal_library', bookSchema);

module.exports = bookModel;
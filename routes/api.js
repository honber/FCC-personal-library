/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect   = require('chai').expect;
const mongoose = require('mongoose');
const bookModel = require ('../model/books.js');
const addCommentsNumbersToBooksList = require('../controllers/getFullBooksListHandler.js');

const CONNECTION_STRING = process.env.MLAB_URI;

const connectOptions = { 
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(CONNECTION_STRING, connectOptions, err => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  }
  else {
    console.log('Connection to database successful'); 
  }
});


module.exports = function (app) {

  app.route('/api/books')
    .get((req, res) => {
      bookModel.find((error, response) => {
        if (error) {
          res.send(error)
        }
        else {
          res.json(addCommentsNumbersToBooksList(response));
        }
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post((req, res) => {
      const title = req.body.title;
      const comments = [];
      
      if (title === '') {
        res.send('missing title');
      }
      else {
        const newBookToSaveInLibrary = new bookModel({
        title,
        comments
        })
        newBookToSaveInLibrary.save((error, response) =>{
          if (error) {
            res.send(error.message)
          }
          else {
            res.json(response)
          }
        })        
      }
    })
    
    .delete(function(req, res){
      bookModel.deleteMany({}, (error, response) =>{
        if (error) {
          res.send(error);
        }
        else {
          res.send('complete delete successful');
        }
      })
      //if successful response will be 'complete delete successful
    });



  app.route('/api/books/:id')
    .get((req, res) => {
      const bookId = req.params.id;
      bookModel.findById(bookId, (error, response) => {
        if (error) {
          res.send('no book exists');
        }
        else {
          res.send(response);
        }
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post((req, res) => {
      const bookId = req.params.id;
      const newComment = req.body.comment;
      bookModel.findById({_id: bookId}, (error, response) => {
        if (error) {
          res.send('no book exists')
        }
        else {
          const bookToUpdate = {
            _id: response._id,
            title: response.title,
            comments: response.comments.slice()
          }
          const commentsToUpdate = response.comments.slice()
          const updatedComments = [...commentsToUpdate, newComment]
          const updatedBook = {...bookToUpdate, comments: updatedComments};
          const options = {new: true}; // the third parameter of findByIdAndUpdate method set to {new: true} forces it to return the updated object
          bookModel.findByIdAndUpdate({_id: bookId}, {comments: updatedComments}, options, (error, response2) => {
            if (error) {
              res.send(error)
            }
            else {
              res.json(response2);
            }
          })
        }
      })
      //json res format same as .get
    })
    
    .delete((req, res) => {
      var bookid = req.params.id;
      bookModel.findByIdAndRemove(bookid, (error, response) => {
        if (error) {
          res.send(error)
        }
        else {
          res.send('delete successful');
        }
      })
      //if successful response will be 'delete successful'
    });
  
};

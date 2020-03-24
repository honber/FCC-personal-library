'use strict'

function addCommentsNumbersToBooksList(booksList){
  const booksListWithCommentsNumbers = booksList.map(book => { return {
      _id: book._id,
      title: book.title,
      comments: book.comments,
      commentcount: book.comments.length
    }
  });
  return booksListWithCommentsNumbers
}

module.exports = addCommentsNumbersToBooksList;
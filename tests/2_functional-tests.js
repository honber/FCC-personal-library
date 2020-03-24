/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/
'use strict'

const chaiHttp = require('chai-http');
const chai     = require('chai');
const assert   = chai.assert;
const server   = require('../server');

chai.use(chaiHttp);

let bookId;

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', done => {
     chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {


    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title', done => {
        chai.request(server)
          .post('/api/books')
          .send(
            {title: 'Adventures of Gandalf'} 
          )
        .end((err, res) => {
          bookId = res.body._id;
           
          assert.equal(res.status, 200);  
          assert.property(res.body, 'title');
          assert.equal(res.body.title, 'Adventures of Gandalf');
          done();
        })
      });
      
      test('Test POST /api/books with no title given', done => {
        chai.request(server)
          .post('/api/books')
          .send(
            {title: ''}
          )
        .end((err, res) => {
          assert.equal(res.status, 200);  
          assert.equal(res.text, 'missing title');
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', () => {
      
      test('Test GET /api/books',  done => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db',  done => {
        chai.request(server)
          .get('/api/books/notvalidid')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  done => {
        chai.request(server)
          .get(`/api/books/${bookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.equal(res.body.title, 'Adventures of Gandalf');
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', done => {
        const newComment = 'New comment';
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send({
          comment: newComment
          })
          .end((err, res) => {
            const indexOfNewestComment = res.body.comments.length - 1;
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments'); 
            assert.equal(res.body.comments[indexOfNewestComment], 'New comment');
            done();
          });
        })
      });

    
    suite('DELETE /api/books/[id]', ()=>{
      
      test('Test DELETE /api/books/[id]', done => {
        chai.request(server)
          .delete(`/api/books/${bookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful'); 
            done();
        });
      }); 
    });
  });
});

// Name:        Meher Salim
// Date:        06/19/2024
// Filename:    app.spec.js
// Description: Unit tests for in-n-out-books API routes using Jest

// Import necessary modules
const request = require('supertest'); // Supertest for HTTP assertions
const app = require('../src/app'); // Import the Express app
const books = require('../database/books'); // Import the books collection

// Define the test suite for Chapter 3 API tests
describe('Chapter 4: API Tests', () => {
  // Test case for retrieving an array of books
  it('Should return an array of books', async () => {
    // Make a GET request to the /api/books endpoint
    const res = await request(app).get('/api/books');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test case for retrieving a single book by ID
  it('Should return a single book', async () => {
    const bookId = 1; // Define a valid book ID
    // Make a GET request to the /api/books/:id endpoint
    const res = await request(app).get(`/api/books/${bookId}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', bookId);
  });

  // Test case for handling invalid book ID
  it('Should return a 400 error if the id is not a number', async () => {
    // Make a GET request to the /api/books/not-a-number endpoint
    const res = await request(app).get('/api/books/not-a-number');
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid book ID');
  });
});

describe('Chapter 4: API Tests', () => {
  beforeEach(() => {
    // Reset the books collection before each test
    books.data = [
      { id: 1, title: "The Fellowship of the Ring", author: "J.R.R. Tolkien" },
      { id: 2, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling" },
      { id: 3, title: "The Two Towers", author: "J.R.R. Tolkien" },
      { id: 4, title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling" },
      { id: 5, title: "The Return of the King", author: "J.R.R. Tolkien" },
    ];
  });

  it('Should return a 201-status code when adding a new book', async () => {
    const newBook = { id: 6, title: "New Book", author: "New Author" };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', newBook.title);
  });

  it('Should return a 400-status code when adding a new book with missing title', async () => {
    const newBook = { id: 7, author: "New Author" };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Book title is required');
  });

  it('Should return a 204-status code when deleting a book', async () => {
    const bookId = 1;
    const res = await request(app).delete(`/api/books/${bookId}`);
    expect(res.statusCode).toEqual(204);
  });
});
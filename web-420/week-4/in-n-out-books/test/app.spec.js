// Name:        Meher Salim
// Date:        06/19/2024
// Filename:    app.spec.js
// Description: Unit tests for in-n-out-books API routes using Jest

// Import necessary modules
const request = require('supertest'); // Supertest for HTTP assertions
const app = require('../src/app'); // Import the Express app
const books = require('../database/books'); // Import the books collection

// Define the test suite for Chapter 3 API tests
describe('Chapter 3: API Tests', () => {
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

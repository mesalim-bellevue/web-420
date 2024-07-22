// Name:        Meher Salim
// Date:        06/19/2024
// Filename:    app.spec.js
// Description: Unit tests for in-n-out-books API routes using Jest

// Import necessary modules
const request = require('supertest'); // Supertest for HTTP assertions
const bcrypt = require('bcryptjs'); // bcrypt for hashing and comparing passwords

const app = require('../src/app'); // Import the Express app
const books = require('../database/books'); // Import the books collection
const users = require('../database/users'); // Import the users collection

const saltRounds = 10; // Define the saltRounds variable

// Define the test suite for Chapter 3 API tests
describe('Chapter 3: API Tests', () => {
  // Test case for retrieving an array of books
  it('Should return an array of books', async () => {
    // Make a GET request to the /api/books endpoint
    const res = await request(app).get('/api/books');
    
    // heck that response status is code 200 (good request)
    expect(res.statusCode).toEqual(200);
    // Check that response body is an array
    expect(res.body).toBeInstanceOf(Array);
    // Check array is not empty
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test case for retrieving a single book by ID
  it('Should return a single book', async () => {
    const bookId = 1; // Define a valid book ID
    // Make a GET request to the /api/books/:id endpoint
    const res = await request(app).get(`/api/books/${bookId}`);
    
    // heck that response status is code 200 (good request)
    expect(res.statusCode).toEqual(200);
    // Check  response body contains expected book ID
    expect(res.body).toHaveProperty('id', bookId);
  });

  // Test case for handling invalid book ID
  it('Should return a 400 error if the id is not a number', async () => {
    // Make a GET request to the /api/books/not-a-number endpoint
    const res = await request(app).get('/api/books/not-a-number');
    
    // Check that response status is code 400 (bad request)
    expect(res.statusCode).toEqual(400);
    // Check response body contains appropriate error message
    expect(res.body).toHaveProperty('error', 'Invalid book ID');
  });
});

// Define the test suite for Chapter 4 API tests
describe('Chapter 4: API Tests', () => {
  beforeEach(() => {
    // Reset the books collection before each test
    books.data = [
      { id: 1, title: "Throne of Glass", auhtor: "Sarah J. Maas" },
      { id: 2, title: "Vampire Academy", author: "Richelle Mead" },
      { id: 3, title: "Poison Study", author: "Maria V. Snyder"},
      { id: 4, title: "Riley Thorn and the Dead Guy Next Door", author: "Lucy Score"},
      { id: 5, title: "Private Eye: A Tiger's Eye Mysetry", author: "Alyssa Day"},
      { id: 6, title: "Touch of Power", author: "Maria V. Snyder"},
      { id: 7, title: "A Court of Thorns and Roses", author: "Sarah J. Maas"},
      { id: 8, title: "Storm Born", author: "Richelle Mead"},
      { id: 9, title: "A Hoe Lot of Trouble", author: "Heather Webber"},
      { id: 10, title: "It Takes a Witch", author: "Heather Blake"},    ];
  });

  // Test case for adding a new book
  it('Should return a 201-status code when adding a new book', async () => {
    const newBook = { id: 6, title: "New Book", author: "New Author" };
    // Make a POST request to the /api/books endpoint
    const res = await request(app).post('/api/books').send(newBook);

    // Check that response status code is 201 (Created)
    expect(res.statusCode).toEqual(201);
    // Check the response body contains the new book title
    expect(res.body).toHaveProperty('title', newBook.title);
  });

  // Test case for handling missing title when adding a new book
  it('Should return a 400-status code when adding a new book with missing title', async () => {
    const newBook = { id: 7, author: "New Author" };
    // Make a POST request to the /api/books endpoint
    const res = await request(app).post('/api/books').send(newBook);
    
    // Check that response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Check response body contain the appropriate error message
    expect(res.body).toHaveProperty('error', 'Book title is required');
  });

  // Test case for deleting a book
  it('Should return a 204-status code when deleting a book', async () => {
    const bookId = 1;
    // Make a DELETE request to the /api/books/:id endpoint
    const res = await request(app).delete(`/api/books/${bookId}`);
    
    // Check that response status code is 204 (No Content)
    expect(res.statusCode).toEqual(204);
  });
});

// Define the test suite for Chapter 5 API tests
describe('Chapter 5: API Test', () => {
  beforeEach(() => {
    //Reset the books collection before each test
    books.data = [
      { id: 1, title: "Throne of Glass", auhtor: "Sarah J. Maas" },
      { id: 2, title: "Vampire Academy", author: "Richelle Mead" },
      { id: 3, title: "Poison Study", author: "Maria V. Snyder"},
      { id: 4, title: "Riley Thorn and the Dead Guy Next Door", author: "Lucy Score"},
      { id: 5, title: "Private Eye: A Tiger's Eye Mysetry", author: "Alyssa Day"},
      { id: 6, title: "Touch of Power", author: "Maria V. Snyder"},
      { id: 7, title: "A Court of Thorns and Roses", author: "Sarah J. Maas"},
      { id: 8, title: "Storm Born", author: "Richelle Mead"},
      { id: 9, title: "A Hoe Lot of Trouble", author: "Heather Webber"},
      { id: 10, title: "It Takes a Witch", author: "Heather Blake"},
    ];
  });

  // Test case for updating a book and returning a 204-status code
  it('Should update a book and return a 204-status code', async () => {
    const updatedBook = { title: "Updated Book", author: "Updated Author" };
    // Make a PUT request to the /api/books/:id endpoint
    const res = await request(app).put('/api/books/2').send(updatedBook);

    // Check that response status code is 204 (No Content)
    expect(res.statusCode).toEqual(204);
  });

  // Test case for handling non-numeric id when updating a book
  it('Should return a 400-status code when using a non-numeric id', async () => {
    const updatedBook = { title: "Updated Book", author: "Updated Author" };
    // Make a PUT request to the /api/books/foo endpoint
    const res = await request(app).put('/api/books/foo').send(updatedBook);

    // Check that response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Check response body contains appropriate error message
    expect(res.body).toHaveProperty('error', 'ID must be a number');
  });

  // Test case for handling missing title when updating a book
  it('Should return a 400-status code when updating a book with a missing title', async () => {
    const updatedBook = { author: "Updated Author" };
    // Make a PUT request to the /api/books/:id endpoint
    const res = await request(app).put('/api/books/2').send(updatedBook);

    // Check that response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Check resposne body contains the appropriate error message
    expect(res.body).toHaveProperty('error', 'Bad Request: Missing title');
  });
});

// Define the test suite for Chapter 6 API tests
describe('Chapter 6: API Tests', () => {
  beforeEach(() => {
    // Reset the users collection before each test
    users.data = [
      {
        id: 1,
        email: "harry@hogwarts.edu",
        password: bcrypt.hashSync("potter", saltRounds),
        securityQuestions: [
          { question: "What is your pet's name?", answer: "Hedwig" },
          { question: "What is your favorite book?", answer: "Quidditch Through the Ages" },
          { question: "What is your mother's maiden name?", answer: "Evans" },
        ]
      }
    ];
  });

  // Test case for successful login
  it('Should log a user in and return a 200-status with "Authentication successful" message', async () => {
    const loginData = {
      email: "harry@hogwarts.edu",
      password: "potter"
    };

    const res = await request(app).post('/api/login').send(loginData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Authentication successful');
  });

  // Test case for unauthorized login
  it('Should return a 401-status code with "Unauthorized" message when logging in with incorrect credentials', async () => {
    const loginData = {
      email: "harry@hogwarts.edu",
      password: "wrongpassword"
    };

    const res = await request(app).post('/api/login').send(loginData);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  // Test case for missing email or password
  it('Should return a 400-status code with "BadRequest" when missing email or password', async () => {
    const loginData = {
      password: "potter"
    };

    const res = await request(app).post('/api/login').send(loginData);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Email and password are required');

    const loginData2 = {
      email: "harry@hogwarts.edu"
    };

    const res2 = await request(app).post('/api/login').send(loginData2);
    expect(res2.statusCode).toEqual(400);
    expect(res2.body).toHaveProperty('error', 'Email and password are required');
  });
});

// Define the test suite for Chapter 7 API tests
describe('Chapter 7: API Tests', () => {
  // Test case for successful security question verification
  it('Should return a 200 status with "Security questions successfully answered" message', async () => {
    const email = "harry@hogwarts.edu";
    const securityQuestions = [
      { answer: "Hedwig" },
      { answer: "Quidditch Through the Ages" },
      { answer: "Evans" }
    ];

    const res = await request(app)
      .post(`/api/users/${email}/verify-security-question`)
      .send(securityQuestions);

    // Check that response status code is 200
    expect(res.statusCode).toEqual(200);
    // Check the response body contains success message
    expect(res.body).toHaveProperty('message', 'Security questions successfully answered');
  });


  // Test case for validation failure with invalid request body
  it('Should return a 400 status with "Bad Request" message when the request body fails ajv validation', async () => {
  const email = "harry@hogwarts.edu";
  const invalidSecurityQuestions = [
    // Define invalid secuirty questoins with missing required third question
    { answer: "Hedwig" },
    { answer: "Quidditch Through the Ages" }
  ];

  const res = await request(app)
    .post(`/api/users/${email}/verify-security-question`)
    .send(invalidSecurityQuestions);

  expect(res.statusCode).toEqual(400);
  expect(res.body).toHaveProperty('error', 'Bad Request');
  expect(res.body).toHaveProperty('details');
  expect(res.body.details).toBeInstanceOf(Array);
});

  // Test case for unauthorized access due to incorrect answers
  it('Should return a 401 status with "Unauthorized" message when the security questions are incorrect', async () => {
    const email = "harry@hogwarts.edu";
    const incorrectSecurityQuestions = [
      { answer: "Wrong Answer 1" },
      { answer: "Wrong Answer 2" },
      { answer: "Wrong Answer 3" }
    ];

    const res = await request(app)
      .post(`/api/users/${email}/verify-security-question`)
      .send(incorrectSecurityQuestions);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });
});
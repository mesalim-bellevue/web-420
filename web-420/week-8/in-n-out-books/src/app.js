// Name: Meher Salim
// Date: 06/14/2024
// Filename: app.js
// Description: Setup initial project structure and creating the server for your application.

const express = require('express');
const bcrypt = require('bcryptjs');

const Ajv = require('ajv');
const ajv = new Ajv();

const app = express();
const port = process.env.PORT || 3001; // Use port 3001

const books = require('../database/books'); // Import the books collection
const users = require('../database/users'); // Import the users collection

// Middleware to serve static files (like CSS, images) in a directory named 'public'
app.use(express.static('public'));

// Middleware to parse JSON request body
app.use(express.json());

// GET route for the root URL "/"
app.get('/', (req, res) => {
  // Assuming you have an HTML file for the landing page in the 'public' directory
  res.sendFile(__dirname + '/../public/index.html');
});

// GET route to return an array of books
app.get('/api/books', async (req, res) => {
  try {
    const allBooks = await books.find();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET route to return a single book by id
app.get('/api/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  
  if (isNaN(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }
  
  try {
    const book = await books.findOne({ id: bookId });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route to add a new book
app.post('/api/books', async (req, res) => {
  try {
    const { id, title, author } = req.body;

    if (!title) {
      throw new Error('Book title is required');
    }

    const newBook = { id, title, author };

    await books.insertOne(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE route to delete a book by id
app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookId = parseInt(req.params.id, 10);

    await books.deleteOne({ id: bookId });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error deleting book' });
  }
});

// PUT route to update a book by id
app.put('/api/books/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID must be a number' });
    }

    const { title, author } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Bad Request: Missing title' });
    }

    await books.updateOne({ id }, { title, author });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route for user login authentication
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await users.findOne({ email });

    if (!user) {
      // If user not found, return 401 status code
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Compare the provided password with the hashed password
    const match = bcrypt.compareSync(password, user.password);

    if (!match) {
      // If password does not match, return 401 status code
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // If login is successful, return success message
    res.status(200).json({ message: 'Authentication successful' });
  } catch (error) {
    // If an error occurs, return 500 status code
    res.status(500).json({ error: error.message });
  }
});

// POST route to verify security questions
app.post('/api/users/:email/verify-security-question', async (req, res) => {
  const { email } = req.params;
  const answers = req.body;

  console.log("Received email:", email);
  console.log("Received answers:", answers);

  // Define schema for security question answers
  const securityQuestionSchema = {
    type: 'array',
    minItems: 3,
    maxItems: 3,
    items: {
      type: 'object',
      properties: {
        answer: { type: 'string' }
      },
      required: ['answer'],
      additionalProperties: false
    }
  };

  // Validate the request body against the schema
  const validate = ajv.compile(securityQuestionSchema);
  const valid = validate(answers);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    return res.status(400).json({ error: 'Bad Request', details: validate.errors });
  }

  try {
    // Find the user by email
    const user = await users.findOne({ email });

    if (!user) {
      console.error("User not found:", email);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Ensure that security questions are the same length as answers
    if (user.securityQuestions.length !== answers.length) {
      console.error("Mismatch in number of security questions.");
      return res.status(400).json({ error: 'Bad Request', details: ['Mismatch in number of security questions'] });
    }
    
    // Compare the answers with the user's security questions
    const securityQuestionsMatch = user.securityQuestions.every((q, index) => q.answer === answers[index].answer);

    if (securityQuestionsMatch) {
      res.status(200).json({ message: 'Security questions successfully answered' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware for handling 404 errors (not found)
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

// Middleware for handling 500 errors (internal server errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : '🥞'
    }
  });
});

// Export the Express app instance
module.exports = app;


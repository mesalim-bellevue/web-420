// Name: Meher Salim
// Date: 06/14/2024
// Filename: app.js
// Description: Setup initial project structure and creating the server for your application.

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Use port 3001
const books = require('../database/books'); // Import the books collection

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
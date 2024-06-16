// Name: Meher Salim
// Date: 06/14/2024
// Filename: app.js
// Description: Setup initial project structure and creating the server for your application.

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Use port 3001

// Middleware to serve static files (like CSS, images) in a directory named 'public'
app.use(express.static('public'));

// Middleware to parse JSON request body
app.use(express.json());

// GET route for the root URL "/"
app.get('/', (req, res) => {
  // Assuming you have an HTML file for the landing page in the 'public' directory
  res.sendFile(__dirname + '/public/index.html');
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

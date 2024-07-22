/**
 * Author: Professor Krasso
 * Date: 4/1/2024
 * File Name: books.js
 * Description: Books collection file for the in-n-out-books application; used to store book data
 */

// Require the Collection class
const Collection = require("./collection");

// Array of book objects
const books = new Collection([
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
]);

module.exports = books; // export the books collection
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db');

// Create tasks table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT,
    status TEXT DEFAULT 'Pending'
  )`);
});

module.exports = db;
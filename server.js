const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use(cors());
app.use(bodyParser.json());

app.post('/tasks', (req, res) => {
  const { title, description, due_date } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required.' });
  }
  const query = `INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)`;
  db.run(query, [title, description, due_date], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title, description, due_date, status: 'Pending' });
  });
});

app.get('/tasks', (req, res) => {
  const query = `SELECT * FROM tasks`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, status } = req.body;
  const query = `UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?`;
  db.run(query, [title, description, due_date, status, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Task updated successfully.' });
  });
});


app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM tasks WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Task deleted successfully.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
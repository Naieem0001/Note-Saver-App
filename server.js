require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Connect to MySQL
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


db.getConnection((err, connection) => {
  if (err) {
    console.log('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL! ✅');
  connection.release();
});

// Save a note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  const sql = 'INSERT INTO notes (title, content) VALUES (?, ?)';
  db.query(sql, [title, content], (err, result) => {
    if (err) {
      res.json({ status: 'error', message: err.message });
      return;
    }
    res.json({ status: 'success', message: 'Note saved!' });
  });
});

// Get all notes
app.get('/api/notes', (req, res) => {
  const sql = 'SELECT * FROM notes';
  db.query(sql, (err, results) => {
    if (err) {
      res.json({ status: 'error', message: err.message });
      return;
    }
    res.json(results);
  });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM notes WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.json({ status: 'error', message: err.message });
      return;
    }
    res.json({ status: 'success', message: 'Note deleted!' });
  });
});

// Edit a note
app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
  db.query(sql, [title, content, id], (err, result) => {
    if (err) {
      res.json({ status: 'error', message: err.message });
      return;
    }
    res.json({ status: 'success', message: 'Note updated!' });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
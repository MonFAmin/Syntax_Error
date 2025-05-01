const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// ROUTE: Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ROUTE: Signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  const checkUserSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserSql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

    const insertUserSql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(insertUserSql, [name, email, password, role], (err) => {
      if (err) return res.status(500).json({ message: 'Signup failed' });
      res.status(200).json({ message: 'Signup successful' });
    });
  });
});

// ROUTE: Login
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  const sql = 'INSERT INTO User (Name, Email, Password, User_type) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    return res.status(200).json({ message: 'Signup successful' });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());

require('dotenv').config();

//hosting index.html
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
});

//creating connection with mySQL
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'sql7643637' 
  });

app.post('/increment', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
        console.error('Error getting connection from pool:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
        }
        const sql = 'UPDATE counter SET count = count + 1';
        connection.query(sql, (queryErr, results) => {
        connection.release();
        if (queryErr) {
            console.error('Error executing SQL query:', queryErr);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: 'Counter incremented successfully' });
        });
    });
});

app.get('/retrieveData', (req, res) => {
    pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error getting connection from pool:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    const sql = 'SELECT count FROM counter';
    connection.query(sql, (queryErr, results) => {
        connection.release();
        if (queryErr) {
        console.error('Error executing SQL query:', queryErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
        }
        if (results.length === 0) {
        res.status(404).json({ error: 'Counter not found.' });
        return;
        }
        const data = results[0].count;
        res.json(data);
    });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000')
});
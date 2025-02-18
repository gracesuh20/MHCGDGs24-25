// Load environment variables from .env file
require('dotenv').config(); 

// Import required modules
const express = require('express'); // Express module to create the web server
const mysql = require('mysql2');    // mysql2 module to connect to MySQL database
const bcrypt = require('bcrypt');   // bcrypt module to securely hash and compare passwords
const bodyParser = require('body-parser'); // body-parser module to parse HTTP request bodies
const jwt = require('jsonwebtoken');  // JWT module to generate tokens
require('dotenv').config();         // dotenv module to read environment variables from .env file

// Create an Express app
const app = express();
// Set the port for the server to run on
const port = 3000;

// Use bodyParser to parse incoming JSON requests
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,     // Database host from .env file
    user: process.env.DB_USER,     // Database user from .env file
    password: process.env.DB_PASSWORD, // Database password from .env file
    database: process.env.DB_NAME  // Database name from .env file
});

// Connect to the MySQL database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack); // Log an error if connection fails
        return;
    }
    console.log('Connected to database.'); // Log success if connection is successful
});

// Register user endpoint (POST request)
app.post('/register', async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // If email or password is missing, return a 400 error with a message
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Hash the password using bcrypt for security
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt

        // SQL query to insert the user into the database
        const query = 'INSERT INTO Users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // If the email already exists, return a 409 conflict error
                    return res.status(409).json({ message: 'Email already exists.' });
                }
                console.error(err); // Log any other errors
                return res.status(500).json({ message: 'Database error.' });
            }
            // If the user is successfully registered, return a 201 status with a success message
            res.status(201).json({ message: 'User registered successfully.' });
        });
    } catch (err) {
        console.error(err); // If there is an error hashing the password, log it
        res.status(500).json({ message: 'Error hashing password.' }); // Return an error message
    }
});

// Login user endpoint (POST request)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // If email or password is missing, return a 400 error with a message
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // SQL query to find the user by email
    const query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err); // Log any errors that occur during the query
            return res.status(500).json({ message: 'Database error.' }); // Return a 500 error for database issues
        }

        // If no user is found with the given email, return a 404 error
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = results[0]; // Get the user data from the query results
        // Compare the provided password with the stored hashed password
        const match = await bcrypt.compare(password, user.password); 
        if (!match) {
            // If the passwords don't match, return a 401 error
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // If login is successful, create a JWT token
        try {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful.', token });
        } catch (error) {
            console.error('JWT generation error:', error);
            res.status(500).json({ message: 'Error generating token.' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); // Log a message when the server starts
});

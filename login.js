const mysql = require('mysql');
const express = require('express');
const session = require('express-session');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Gkswodls812!',
    database : 'loginDB'
});

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to test server connection
app.get('/', function (request, response) {
    response.json({ message: 'Backend server is running' });
});

// Authentication route for login
app.post('/auth', function (request, response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;

    // Ensure the input fields exist and are not empty
    if (username && password) {
        // Execute SQL query to select account from database
        connection.query(
            'SELECT * FROM accounts WHERE username = ? AND password = ?',
            [username, password],
            function (error, results, fields) {
                if (error) throw error;

                // If the account exists
                if (results.length > 0) {
                    // Authenticate the user
                    request.session.loggedin = true;
                    request.session.username = username;

                    // Respond with a success message
                    response.json({ message: 'Login successful', username: username });
                } else {
                    response.status(401).json({ message: 'Incorrect Username and/or Password!' });
                }
            }
        );
    } else {
        response.status(400).json({ message: 'Please enter Username and Password!' });
    }
});

// Protected route for logged-in users
app.get('/home', function (request, response) {
    // Check if the user is logged in
    if (request.session.loggedin) {
        response.json({ message: `Welcome back, ${request.session.username}!` });
    } else {
        response.status(403).json({ message: 'Please login to view this page!' });
    }
});

app.listen(3000, () => {
    console.log('Backend server is running on http://localhost:3000');
});

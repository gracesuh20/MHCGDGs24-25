// Load environment variables from .env
require('dotenv').config();

// Import MySQL library
const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,        // The host (from .env)
    user: process.env.DB_USER,        // The username (from .env)
    password: process.env.DB_PASSWORD, // The password (from .env)
    database: process.env.DB_NAME     // The database name (from .env)
});

// Connect to the database and handle connection errors
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Export the connection so it can be used in other files
module.exports = connection;

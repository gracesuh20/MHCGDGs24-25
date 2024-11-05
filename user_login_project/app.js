const db = require('./db');  // Import the database connection from db.js

// Test the database connection by inserting and retrieving data

function testDatabaseConnection() {
    const email = "test@example.com";
    const password = "password123";
    const name = "Test User";

    // Insert a sample user
    db.query("INSERT INTO users (email, password, name) VALUES (?, ?, ?)", [email, password, name], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return;
        }
        console.log("User inserted with ID:", result.insertId);

        // Fetch and display the inserted user
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
            if (err) {
                console.error("Error fetching user:", err);
                return;
            }
            console.log("Fetched user:", results[0]);
        });
    });
}

// Call the test function to confirm everything is working
testDatabaseConnection();
testDatabaseConnection("mhc@example.com", "password2027", "GDGLead");



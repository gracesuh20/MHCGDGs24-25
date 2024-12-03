const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed
const path = require('path'); // For serving static files
const bodyParser = require('body-parser');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'gdgteam3@mhc',
    database: 'loginDB',
});

const app = express();
const PORT = 3306;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecretKey', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname))); // Serve static files like login.html and styles.css

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL Database!');
});

// Handle form submission for registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save data to MySQL
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        connection.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error saving data:', err);
                return res.status(500).send('Database error');
            }

            console.log('Data saved:', result);
            res.send('User registered successfully!');
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Internal server error');
    }
});

// Handle login requests
app.post('/login', (req, res) => {
  const { username, email, password } = req.body;

  // Prefer email if provided, fallback to username
  const identifier = email || username;
  const sql = `SELECT * FROM users WHERE ${email ? 'email' : 'username'} = ?`;

  connection.query(sql, [identifier], async (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Internal server error');
      }

      if (results.length === 0) {
          return res.status(400).send('User not found');
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
          req.session.user = { id: user.id, username: user.username };
          res.send('Login successful');
      } else {
          res.status(400).send('Invalid password');
      }
  });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

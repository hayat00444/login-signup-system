const express = require("express");
const path = require("path");
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// In-memory user storage (we'll use a database later)
let users = [];

// Signup route
app.post("/api/signup", (req, res) => {
    const { email, password } = req.body;
    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    // Generate a 5-digit UID
    const uid = Math.floor(10000 + Math.random() * 90000).toString();
    // Add user to the array
    const newUser = { uid, email, password, balance: 0 };
    users.push(newUser);
    res.json({ message: "Signup successful", uid });
});

// Login route
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(
        (user) => user.email === email && user.password === password,
    );
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ message: "Login successful", uid: user.uid });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

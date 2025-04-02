const express = require("express");
const app = express();

// Middleware to parse JSON data (needed for login/signup forms)
app.use(express.json());

// A test route to check if the server works
app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

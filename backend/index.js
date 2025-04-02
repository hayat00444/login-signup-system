const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// In-memory user storage (we'll use a database later)
let users = [];

// Create the server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Serve static files from the frontend folder
    if (req.method === 'GET' && (pathname === '/' || pathname.startsWith('/signup.html'))) {
        let filePath = path.join(__dirname, '../frontend', pathname === '/' ? 'index.html' : pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Handle signup (POST request to /api/signup)
    else if (req.method === 'POST' && pathname === '/api/signup') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { email, password } = JSON.parse(body);
            // Check if user already exists
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User already exists' }));
                return;
            }
            // Generate a 5-digit UID
            const uid = Math.floor(10000 + Math.random() * 90000).toString();
            // Add user to the array
            const newUser = { uid, email, password, balance: 0 };
            users.push(newUser);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Signup successful', uid }));
        });
    }
    // Handle login (POST request to /api/login)
    else if (req.method === 'POST' && pathname === '/api/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { email, password } = JSON.parse(body);
            const user = users.find(user => user.email === email && user.password === password);
            if (!user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid email or password' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Login successful', uid: user.uid }));
        });
    }
    // Handle 404 for unknown routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
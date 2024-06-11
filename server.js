/**
 * Initializes an Express server with specified routes and middleware.
 * Serves static files from the '/assets' directory.
 * Defines routes for the root path ('/') and '/ask'.
 * Starts the server on the specified PORT or default port 3033.
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3033;

const routes = require('./src/routes/api');
const runningBill = require('./src/routes/runningbillApi');

app.use(runningBill);
app.use(routes);
app.use('/assets', express.static(path.join(__dirname, 'public','/assets')));

// Your other routes and middleware
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/ask', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

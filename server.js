const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;



// Serve static assets from the 'assets' directory
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

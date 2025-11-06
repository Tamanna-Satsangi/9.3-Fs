const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    instance: process.env.INSTANCE_ID || 'local'
  });
});

app.get('/api/data', (req, res) => {
  res.json({ 
    data: 'Sample data from backend',
    instance: process.env.INSTANCE_ID || 'local'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const contactsRouter = require('./routes/contacts');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static assets from public directory
app.use(express.static('src/public'));

// REST API routes
app.use('/api/contacts', contactsRouter);

module.exports = app;

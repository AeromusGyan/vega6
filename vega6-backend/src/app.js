require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");

const Routes = require('./routes/routes');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Replace with the allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Specify allowed headers
}));
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});
app.get('/api/health', async (req, res) => {
    res.send({message: 'Server is healthy!', status: 200});
});

// Initialize routes
Routes.initializeRoutes(app);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;

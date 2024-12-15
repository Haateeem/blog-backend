const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const mongoURI = "mongodb+srv://hatim:123@blogappcluster.qvazw.mongodb.net/?retryWrites=true&w=majority";

let db;

// Establish MongoDB connection
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('test');  // Connect to 'test' database
        console.log('MongoDB connected');

        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        app.use('/api/blogs', blogRoutes(db)); // Pass db to routes

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

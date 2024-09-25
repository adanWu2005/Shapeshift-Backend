require('dotenv').config();
const express = require("express");
const cors = require('cors');
const crypto = require('crypto');
const corsOptions = require('./config/corsOptions');
const path = require('path')
const verifyToken = require('./middleware/verifyToken');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors(corsOptions));

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/protected-route', verifyToken, (req, res) => {
    res.json({ message: "This is a protected route.", user: req.user });
})

app.use('/signup', require('./routes/signupRoutes'))

app.use('/login', require('./routes/loginRoutes'))

mongoose.connect(process.env.MONGO_ID).then(() => {
    app.listen(3000, () => {
        console.log("Server listening on port 3000");
    });
    console.log("mongodb");
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



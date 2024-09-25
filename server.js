require('dotenv').config();
const express = require("express");
const cors = require('cors');
const crypto = require('crypto');
const corsOptions = require('./config/corsOptions');
const path = require('path')
const connectDB = require('./config/dbConn');
const verifyToken = require('./middleware/verifyToken');

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors(corsOptions));

connectDB();


app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/protected-route', verifyToken, (req, res) => {
    res.json({ message: "This is a protected route.", user: req.user });
})

app.use('/signup', require('./routes/signupRoutes'))

app.use('/login', require('./routes/loginRoutes'))

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

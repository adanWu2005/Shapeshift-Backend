const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/workoutUser');

const addUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ username: newUser.username }, process.env.JWT_ACCESS_KEY, { expiresIn: '1h' });

        return res.status(201).json({ message: "User created successfully.", token});
    } catch (error) {
        console.error("Signup error: ", error);
        return res.status(500).json({ message: "Server error." });
    }
};

module.exports = addUser
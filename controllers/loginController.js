const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/workoutUser');

const loggingIn = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ username: user.username }, process.env.JWT_ACCESS_KEY, { expiresIn: '1h' });

            console.log({ message: "Login successful.", token });

            return res.status(200).json({ message: "Login successful.", token });
        } else {
            return res.status(401).json({ message: "Invalid username or password." });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error." });
    }
};

module.exports = loggingIn;

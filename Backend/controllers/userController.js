const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


const registerUser = async (req, res) => {
    const { username, password, name, age } = req.body;

    if (!username || !password || !name || !age) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await User.create({ username, password, name, age });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user.id,
                username: user.username,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };

// authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Make sure the path to your User model is correct
const jwt = require('jsonwebtoken');
// Render the login page
exports.renderLoginPage = (req, res) => {
    res.render('login', { errorMessage: null });
};


const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'defaultSecretKey',
        { expiresIn: '1h' }
    );
};

// Handle Signup
exports.signup = async (req, res, salt) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10, "superSecret", salt) {}
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = generateToken(newUser);
        res.status(201).json({
            message: 'User registered successfully!',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Handle Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.status(200).json({
            message: 'Login successful!',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Handle logout
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirect to login page after logout
    });
};

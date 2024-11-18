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
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    const redirectTo = req.body.redirectTo || '/';

    try {
        // Create user (password will be hashed automatically in the pre-save hook)
        const newUser = await User.create({ username, email, password });

        console.log("User registered:", newUser);

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });

        // Set cookie with the token
        res.cookie('token', token, { httpOnly: true });

        // Redirect after successful signup
        res.redirect(redirectTo);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(400).render('signup', { errorMessage: 'Error registering user', redirectTo });
    }
};

// Handle logout
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirect to login page after logout
    });
};

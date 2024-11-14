// authController.js
const bcrypt = require('bcrypt');
const User = require('../models/users'); // Make sure the path to your User model is correct

// Render the login page
exports.renderLoginPage = (req, res) => {
    res.render('login', { errorMessage: null });
};

// Handle login form submission
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
        return res.render('login', { errorMessage: 'Please fill in all fields.' });
    }

    try {
        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { errorMessage: 'Invalid email or password.' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { errorMessage: 'Invalid email or password.' });
        }

        // Authentication successful; create a session or JWT token
        req.session.userId = user._id;
        res.redirect('/dashboard'); // Redirect to a secure page after login (e.g., user dashboard)
    } catch (error) {
        console.error('Error during login:', error);
        res.render('login', { errorMessage: 'Something went wrong, please try again.' });
    }
};

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "An error occurred, please try again later" });
    }
};

// Handle logout
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirect to login page after logout
    });
};

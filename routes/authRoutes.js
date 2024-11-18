const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path to your model

// User Signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const sanitizedPassword = password.trim(); // Remove any extra spaces
    const redirectTo = req.body.redirectTo || '/';

    try {
        // Step 1: Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Step 2: Hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);

        // Step 3: Save the new user with the hashed password
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword // Store the hashed password in the database
        });

        console.log("User registered:", newUser);

        // Step 4: Generate a JWT token for the user (optional)
        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Step 5: Set the token as an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });

        console.log("Registration token generated and cookie set:", token);

        // Redirect the user to the desired page after successful registration
        res.redirect(redirectTo);

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(400).json({ success: false, message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Step 1: Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Step 3: Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });

        // Step 4: Set the JWT token as an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });

        console.log("Login successful, token generated:", token);
        res.redirect('/'); // Redirect after successful login (you can change the route)

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: 'Server error during login', error });
    }
});


module.exports = router;
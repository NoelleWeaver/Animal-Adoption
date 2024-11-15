// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const bcrypt = require('bcrypt');
const User = require('../models/users');

router.get("/login", (req, res) => {
    res.render("login"); // Render the login page
});

router.post("/login", authController.login);

// routes/auth.js
 // Your User schema file

// Sign up route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).send('User registered successfully!');
    } catch (error) {
        res.status(500).send('Error registering user: ' + error.message);
    }
});

router.get("/signup", (req, res) => {
    res.render("signup"); // Render signup.ejs
});

router.post("/signup", authController.signup);

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('No user found with this email');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Incorrect password');
        }

        res.send('Login successful!');
    } catch (error) {
        res.status(500).send('Error logging in: ' + error.message);
    }
});

module.exports = router;


module.exports = router;

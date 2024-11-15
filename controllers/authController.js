// authController.js
const bcrypt = require('bcrypt');
const User = require('../models/users'); // Make sure the path to your User model is correct

// Render the login page
exports.renderLoginPage = (req, res) => {
    res.render('login', { errorMessage: null });
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Fetch user by email and check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // If login successful
        console.log("Login successful");
        res.redirect("/");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong, please try again", error: error.message });
    }
    
};

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Something went wrong during signup" });
    }
};

// Handle logout
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirect to login page after logout
    });
};

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controllers/authController');
require('dotenv').config();

// Render Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Signup Route
router.post('/signup', authController.signup);

// Login Route
router.post('/login', authController.login);

module.exports = router;
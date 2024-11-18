const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Invalid email format"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8
    }
}, { timestamps: true });

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Only hash if password is modified
    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);  // Pass any error to the next middleware
    }
});

module.exports = mongoose.model('User', userSchema);
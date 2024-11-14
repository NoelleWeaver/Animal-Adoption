const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // To hash passwords

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']  // Minimum length for username
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Only "user" or "admin" are allowed
        default: 'user'  // Default role is "user"
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {  // Only hash if the password has been modified
        this.password = await bcrypt.hash(this.password, 10);  // Hash the password with salt rounds of 10
    }
    next();
});

// Method to compare hashed password
userSchema.methods.comparePassword = async function(pass) {
    return await bcrypt.compare(pass, this.password);  // Compare given password with hashed password
};

module.exports = mongoose.model('User', userSchema);
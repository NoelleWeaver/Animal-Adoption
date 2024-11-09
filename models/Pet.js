const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name Required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age Required'],
        min: [0, 'Age cannot be less than 0']
    },
    location: {
        type: String,
        required: [true, 'Location Required'],
        trim: true
    },
    breed: {
        type: String,
        required: [true, 'Breed Required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    behavior: {
        type: String,
        required: [true, 'Behavior Required'],
        trim: true
    },
    history: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        required: [true, 'Picture Required'],
    },
    images: {
        type: [String], 
        validate: {
            validator: (val) => val.length <= 5,
            message: 'You can upload a maximum of 5 images'
        }
    }
});

module.exports = mongoose.model('Pet', PetSchema)
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
    breed: {
        type: String,
        required: [true, 'Breed Required'],
        trim: true
    },
    behavior: {
        type: String,
        required: [true, 'Behavior Required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    history: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City Required'],
        trim: true
    },
    imageURL: {
        type: String,
        default: '',
        required: [true, 'Profile Image Required']
    }
    });

module.exports = mongoose.model('Pet', PetSchema)
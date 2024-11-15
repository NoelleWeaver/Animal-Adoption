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
    gender: {
        type: String,
        required: [true, 'Gender Required'],
        enum: ['male', 'female', 'other']
    },
    city: {
        type: String,
        required: [true, 'City Required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State Required'],
        enum: ['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 
            'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 
            'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy']
    },
    category: {
        type: String,
        required: [true, 'Category Required'],
        enum: ['dog', 'cat', 'bird', 'fish', 'other'],
    },
    imageURL: {
        type: String,
        default: '',
        required: [true, 'Profile Image Required']
    }
    });

module.exports = mongoose.model('Pet', PetSchema)
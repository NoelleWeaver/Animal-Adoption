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
        enum: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 
            'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 
            'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
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
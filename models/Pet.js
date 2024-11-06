const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    name: {
        type: String,

    }
})

module.exports = mongoose.model('Pet', PetSchema)
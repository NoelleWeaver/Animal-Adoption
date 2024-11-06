const express = require('express');
const router = express.Router();

const {
    getAllPets,
    createPet,
    getPet,
    updatePet,
    deletePet,
} = require('../controllers/pet')

router.route('/').get(getAllPets).post(createPet);

module.exports = router;
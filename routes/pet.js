const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Pet = require('../models/Pet');
const cookieParser = require('cookie-parser');

// Cloudinary configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Animal-Adoption',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
        public_id: (req, file) => file.originalname
    },
});
const upload = multer({ storage });

const {
    getAllPets,
    getPet,
    updatePet,
    deletePet,
    getAddPetsPage,
    getAdminPetsPage,
} = require('../controllers/pet');

router.use(cookieParser());

router.route('/addPet').get(getAddPetsPage);
router.route('/adminPets').get(getAdminPetsPage);
router.route('/petProfile/:id').get(getPet);

// Fetch all pets and pass favorites from cookies
router.route('/').get(async (req, res) => {
    try {
        const pets = await Pet.find();
        const favorites = req.cookies.favorites ? JSON.parse(req.cookies.favorites) : [];
        res.render('index', { pets, favorites });
    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to create pets and handle form submission
router.post('/pets/create', upload.single('image'), async (req, res) => {
    try {
        const { name, gender, age, breed, description, history, city, state, category, behavior } = req.body;
        const imageURL = req.file ? req.file.path : null;
        const newPet = new Pet({
            name,
            gender,
            age,
            breed,
            description,
            history,
            state,
            city,
            category,
            behavior,
            imageURL
        });
        await newPet.save();
        res.status(201).render('success', { newPet });
    } catch (error) {
        console.error("Error creating pet:", error);
        res.status(400).render('404', { error });
    }
});

// Route for admin to delete pets
router.post('/pets/delete/:id', async (req, res) => {
    const petId = req.params.id;
    try {
        await Pet.findByIdAndDelete(petId);
        res.status(200).redirect('/adminPets');
    } catch (error) {
        console.error("Error deleting pet:", error);
        res.status(500).render('404', { error });
    }
});

router.post('/pets/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).redirect('/adminPets');
    } catch (error) {
        console.error("Error deleting pet:", error);
        res.status(500).render('404', { error });
    }
});


// Favorite/Unfavorite a pet
router.post('/pets/favorite/:petId', (req, res) => {
    const petId = req.params.petId;
    let favorites = req.cookies.favorites ? JSON.parse(req.cookies.favorites) : [];

    // Toggle favorite status
    if (favorites.includes(petId)) {
        favorites = favorites.filter(id => id !== petId);
    } else {
        favorites.push(petId);
    }

    // Update favorites cookie
    res.cookie('favorites', JSON.stringify(favorites), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.redirect('/');
});

// Fetch pets by category and render or send as JSON
router.get('/pets/category/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const pets = await Pet.find({ category });
        res.render('category', { pets, category }); // Adjust as per your view requirements
    } catch (error) {
        console.error('Error fetching pets by category:', error);
        res.status(500).send('Error fetching pets');
    }
});



module.exports = router;
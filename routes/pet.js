const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const Pet = require('../models/Pet')
const cookieParser = require('cookie-parser');

//cloudinary configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
        params: {
            folder: 'Animal-Adoption',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
            public_id: (req,file) => file.originalname
        },
})
const upload = multer({ storage })


const {
    getAllPets,
    getPet,
    updatePet,
    deletePet,
    getAddPetsPage,
    getAdminPetsPage,
} = require('../controllers/pet')

router.use(cookieParser());

// router.route('/').get(getAllPets);
router.route('/addPet').get(getAddPetsPage);
router.route('/adminPets').get(getAdminPetsPage);
router.route('/petProfile/:id').get(getPet);

router.route('/').get(async (req, res) => {
    try {
      const pets = await Pet.find(); // Get all pets from the database
      const favorites = req.cookies.favorites ? JSON.parse(req.cookies.favorites) : []; // Get favorites from cookies
  
      // Render the homepage with pets and favorites passed in
      res.render('index', { pets, favorites }); 
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).send("Internal Server Error");
    }
  });

//route to create pets and deal with the form submission
router.post('/pets/create', upload.single('image'), async(req,res) => {
    try {
        const { name, gender, age, breed, description, history, city, category, behavior  } = req.body
        const imageURL = req.file ? req.file.path : null
        const newPet = new Pet({
            name,
            gender,
            age,
            breed,
            description,
            history,
            city,
            category,  // Ensure this is saved to the database
            behavior,
            imageURL
        });
        await newPet.save()
        res.status(201).render('success', { newPet })
    } catch(error) {
        res.status(400).render('404', { error })
    }
});
//route for admin to delete pets
router.post('/pets/delete/:id', async(req, res) => {
    const petId = req.params.id
    try {
        await Pet.findByIdAndDelete(petId)
        res.status(200).redirect('/adminPets')
    } catch(error) {
        res.status(500).render('404', { error })
    }
});

router.route('/:id')
    .get((req, res, next) => {
        console.log(`GET /pets/${req.params.id} -> getPet`);
        next();
    }, getPet)

    router.post('/pets/favorite/:petId', (req, res) => {
        const petId = req.params.petId;
        let favorites = req.cookies.favorites ? JSON.parse(req.cookies.favorites) : [];
      
        // Toggle the favorite status of the pet
        if (favorites.includes(petId)) {
          // Remove the pet from favorites (unfavorite)
          favorites = favorites.filter(id => id !== petId);
        } else {
          // Add the pet to favorites
          favorites.push(petId);
        }
      
        // Update the cookie with the new favorites list
        res.cookie('favorites', JSON.stringify(favorites), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
      
        // Redirect back to the homepage (or wherever you'd like)
        res.redirect('/');
      });

      router.get('/pets/category/:category', async (req, res) => {
        const category = req.params.category; // e.g., 'dog', 'cat', etc.
        try {
            // Find pets by category
            const pets = await Pet.find({ category: category });
    
            if (pets.length === 0) {
                // If no pets found, return a "no pets available" message
                res.render('index', { pets: [], favorites: [] }); 
            } else {
                // Pass the pets and favorites to the view
                const favorites = req.cookies.favorites ? JSON.parse(req.cookies.favorites) : [];
                res.render('index', { pets, favorites });
            }
        } catch (error) {
            console.error('Error fetching pets by category:', error);
            res.status(500).send('Error fetching pets');
        }
    });

    // Route for showing only dogs
router.get('/pets/petDog', async (req, res) => {
    try {
        const dogs = await Pet.find({ category: 'dog' }); // Query for dogs only
        res.render('pets', { pets: dogs, category: 'Dogs' }); // Render the 'pets.ejs' page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching pets');
    }
});

// Route for showing only cats
router.get('/pets/petCat', async (req, res) => {
    try {
        const cats = await Pet.find({ category: 'cat' }); // Query for cats only
        res.render('pets', { pets: cats, category: 'Cats' }); // Render the 'pets.ejs' page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching pets');
    }
});



module.exports = router;
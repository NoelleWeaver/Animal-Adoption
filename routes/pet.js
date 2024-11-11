const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const Pet = require('../models/Pet')

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

router.route('/').get(getAllPets);
router.route('/addPet').get(getAddPetsPage);
router.route('/adminPets').get(getAdminPetsPage);
router.route('/:id').get(getPet);
//route to create pets and deal with the form submission
router.post('/pets/create', upload.single('image'), async(req,res) => {
    try {
        const { name, gender, age, breed, description  } = req.body
        const imageURL = req.file ? req.file.path : null
        const newPet = new Pet({ name, gender, age, breed, description, history, city, type, behavior, imageURL })
        await newPet.save()
        res.status(201).render('success', { newPet})
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
//add pet - form post
// router.post('/pets', upload.single('image'), async(req,res) => {
//     const {title, description } = req.body
//     const imageURL = req.file ? req.file.path : null //cloudinary url is stored in req.file.path
//     const newPet = new Pet({ title, description, imageURL })
//     await newPet.save() //.save only works if you have the model variable imported in this case its pet
//     res.redirect('/')
// })

router.route('/:id')
    .get((req, res, next) => {
        console.log(`GET /pets/${req.params.id} -> getPet`);
        next();
    }, getPet)


module.exports = router;
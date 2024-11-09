const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const Pet = require('../models/Pet')


const {
    getAllPets,
    createPet,
    getPet,
    updatePet,
    deletePet,
} = require('../controllers/pet')

router.route('/').get(getAllPets).post(createPet);
router.route('/:id').get(getPet).patch(updatePet).delete(deletePet);
router.route('/api/v1/pets/:id').patch(updatePet)

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
        params: {
            folder: 'Animal-Adoption',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
            public_id: (req,file) => file.originalname
        },
})

const upload = multer({ storage })

router.get('/', async(req,res) => {
    const pets = await Pet.find({})
    res.render('index', {pets})
})

//add pet - addpet page
router.get('/pets/new', (req,res) => res.render('addPet'))

//add pet - form post
router.post('/pets', upload.single('image'), async(req,res) => {
    const {title, description } = req.body
    const imageURL = req.file ? req.file.path : null //cloudinary url is stored in req.file.path
    const newPet = new Pet({ title, description, imageURL })
    await newPet.save() //.save only works if you have the model variable imported in this case its pet
    res.redirect('/')
})

//edit pet - page
router.get('/pets/edit/:id', async(req, res) => {
    const pet = await Pet.findById(req.params.id)
    res.render('editPet', {pet})
})

//edit pet - form post
router.post('/pets/edit/:id',upload.single('image'), async(req, res) => {
    const {title, description, imageURL} = req.body
    const pet = await Pet.findById(req.params.id)
    if(req.file) pet.imageURL = req.file.path //store the cloudinary url
    pet.title = title
    pet.description = description
    pet.imageURL = imageURL
    await pet.save()
    res.redirect('/')
})

//delete pet
router.post('/pets/delete/:id', async(req, res) => {
    await Pet.findByIdAndDelete(req.params.id)
        res.redirect('/')
})

//mark pet as completed
router.post('/pets/complete/:id', async(req, res) => {
    const pet = await Pet.findById(req.params.id)
    pet.completed = true
    await pet.save()
    res.redirect('/')
})


module.exports = router;
const Pet = require('../models/Pet')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom-error')

//get addPets page
const getAddPetsPage = async(req,res) => {
    try{
        res.status(200).render('addPet')
    } catch(error) {
        res.status(500).render('404', {error})
    }
}
const getAdminPetsPage = async(req,res) => {
    try {
        const pets = await Pet.find({})
        res.status(200).render('adminPets', {pets})
    } catch(error){
        res.status(500).render('404', {error})
    }
    }

const getAllPets = asyncWrapper(async (req, res) => {
    const pets = await Pet.find({})
    res.status(200).render('index', {pets});
})

const getPet = asyncWrapper(async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).send('Pet not found');
        res.render('petProfile', { pet });
    } catch (error) {
        res.status(500).send('Error loading pet details');
    }
})
const deletePet = asyncWrapper(async(req, res)=>{
    const  {id: petID } = req.params
    const pet = await Task.findOneAndDelete({_id: petID})
    if(!pet) {
        return next(createCustomError('No Pet with id'+ petID, 404))
    }
    res.status(200).json({pet})//responds with the task that was deleted
})

const updatePet = asyncWrapper(async(req, res) =>{
    const { id: petID} = req.params

    const pet = await Pet.findOneAndUpdate({_id: petID}, req.body, {
        new: true,
        runValidators: true,
    })
    if(!pet){
        return next(createCustomError('No Pet with id'+ petID, 404))
    }
    res.status(200).json({pet})
})

module.exports = {getAddPetsPage, getAdminPetsPage, getAllPets, getPet, deletePet, updatePet}
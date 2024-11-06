const Pet = require('../models/Pet')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom-error')

const getAllPets = asyncWrapper(async (req, res) => {
    const pets = await Pet.find({})
    res.status(200).json({pets});
})

const createPet = asyncWrapper(async (req, res) => {
    const pet = Pet.create(req.body)
    console.log(req.body)//To check what is being made for dev only...
    res.status(201).json({pet})
})

const getPet = asyncWrapper(async (req, res) => {
    const {id: petID} = req.params
    const pet = await Pet.findOne({_id:petID})
    if(!pet) {
        return next(createCustomError('No Pet with Id' + petID, 404))
    }
    res.status(200).json({pet})
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

module.exports = {getAllPets, createPet, getPet, deletePet, updatePet}
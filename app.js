const express = require('express');
const app = express();
const pet = require('./routes/pet');
const connectDB = require('./db/connect');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const Pet = require('./models/Pet');
const port = process.env.PORT || 5000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Local Middleware
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Library Middleware
app.use(express.urlencoded({ extended: true}))
app.use(express.static('./public'))
app.use(express.json());

//Routes
app.use(notFound)
app.use(errorHandlerMiddleware);
app.use('/api/pets', pet);

app.get('/index', function(req,res){
    res.render('index')
})

//Initiate Server
const serverInit = async () =>{
    try{
        await connectDB();
        console.log('Connected to MongoDB')
        app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
    } catch (error){
        console.error('Error connecting to MongoDB:', error);
    }
}
serverInit()
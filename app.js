const express = require('express');
const app = express();
const pet = require('./routes/pet');
const connectDB = require('./db/connect');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const port = process.env.PORT || 5000
const bodyParser = require('body-parser');
const path = require('path');

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//Local Middleware
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//app config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', pet)
app.use('/petProfile', pet)
//Routes
app.use(notFound)
app.use(errorHandlerMiddleware);



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
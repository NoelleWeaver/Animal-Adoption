const express = require('express');
const app = express();
const pet = require('./routes/pet');
const connectDB = require('./db/connect');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');


// Local Middleware
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// App configuration
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(cookieParser()); // Ensure cookies are parsed before routes
app.use(express.json()); // Use Express built-in middleware for JSON
app.use(express.urlencoded({ extended: true })); // Body parser middleware (Express 4.16+)


app.use(session({
    secret: 'yourSecretKey', // Change this to a strong secret in production
    resave: false,
    saveUninitialized: true,
}));


// Routes
app.use('/', pet);
app.use('/petProfile', pet); // You might want to use more specific route handlers
app.use(authRoutes);
app.use('/auth', authRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

// Initiate server
const serverInit = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT || 5000, () => 
            console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`)
        );
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

serverInit();
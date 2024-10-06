const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
const cloudinary = require('cloudinary');

// Load environment variables
dotenv.config();
const port = process.env.PORT || 5000; // Default to 5000 if PORT is not set

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Update this for production if needed
    credentials: true // Optional, if you need to send cookies or authentication headers
}));
//To open for internet public change the localhost to 3.87.102.196(Server IP)above


// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000' // Specify your frontend URL here
}));
//To open for internet public change the localhost to 3.87.102.196(Server IP) above

// Connect to database
require("./database/conn");

// Routes
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

// API routes
app.use("/api", userRoutes);
app.use("/api", blogRoutes);

// Basic route
app.get("/", (req, res) => {
    res.send("Express: backend");
});

// Example POST route
app.post("/", (req, res) => {
    console.log(JSON.stringify(req.body, null, 2)); // Use null instead of 0 for indentation
    res.status(200).send(req.body);
});

// Start server
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).send("API is running!");
});

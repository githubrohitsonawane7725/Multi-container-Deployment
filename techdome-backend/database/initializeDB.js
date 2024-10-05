const mongoose = require("mongoose");
const Blog = require("./models/blogModel");
const User = require("./models/userModel");

const initializeDatabase = async () => {
    try {
        // Create default collections if they don't exist
        const blogCount = await Blog.countDocuments();
        if (blogCount === 0) {
            // Sample blog data can be added here if needed
            console.log("Creating default Blog collections...");
        }

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            // Sample user data can be added here if needed
            console.log("Creating default User collections...");
        }
    } catch (error) {
        console.error("Error initializing database: ", error);
    } finally {
        mongoose.connection.close();
    }
};

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected...");
        initializeDatabase();
    })
    .catch((error) => {
        console.error("MongoDB connection error: ", error);
    });

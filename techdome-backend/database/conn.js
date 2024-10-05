const mongoose = require("mongoose");
//const initializeDatabase = require('./initializeDB'); // Import the initialize function

// mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Connection established...!");
//         initializeDatabase();
//     })
//     .catch((error) => {
//         console.log(error);
//     });

mongoose.connect(process.env.DB).then(() => {
    console.log("connection established...!");
}).catch((error) => {
    console.log(error);
})
import 'dotenv/config';
import connectDB from './db/index.js';
import express from 'express';
const port = process.env.PORT || 3000;
const app = express();

connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



// first approach pollutes index.js
/*
import mongoose from 'mongoose';
import { DB_NAME } from './constants.js';

;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("error: ", error);
            throw error;
        });
        app.listen(port, () => {
            console.log("Server is running on port: ", port);
        });
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
})()
*/

// second approach (professional backend, industry standard)
// take a file in db folder, write code in it, export function from there, import it in index.js and execute it.
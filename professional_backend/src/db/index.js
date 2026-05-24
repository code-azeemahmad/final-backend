// to communicate with db, problems can arise. Wrap in try-catch or promises
// db is always in another continent, use async/ await
// better approach db should not be connected in one line

import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import 'dotenv/config';

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        // returns a Mongoose connection object.
        console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);    // Program ended with an error
        // Stops the Node.js application immediately.
    }
}

export default connectDB;

// debugging needs common sense
// .env file changes require restarting the app
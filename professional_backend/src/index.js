import 'dotenv/config';
import connectDB from './db/index.js';
const port = process.env.PORT || 3000;
import {app} from './app.js';

/*index.js(entry point) → imports app
            ↓
app.js(const app = express()) → defines routes
            ↓
router → defines endpoints*/

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is listening at ${port}`);
    });
})
.catch((error) => {
    console.log("DB Connection Error:", error);
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
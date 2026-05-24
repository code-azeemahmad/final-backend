import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';   // Allows backend to read cookies from browser.
const port = process.env.PORT;

const app = express();

app.use(cors({  // production level
    origin: process.env.CORS_Origin,
    credentials: true,
}));  // used for middlewares and configurations

app.use(express.json({
    limit: "16kb",
}));    // This middleware allows your backend to read: JSON request bodies

app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}));  // because Express cannot understand form data automatically

app.use(express.static("public"));  // Serves static files from public folder.

// Without this middleware: req.body
// would be: undefined

app.use(cookieParser());

export {app};

// express request object and response object
// req.params and req.body
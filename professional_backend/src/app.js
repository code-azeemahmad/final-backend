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

// routes import
import userRouter from './routes/user.routes.js';

// we were writing app.get() because we were writing routes and controllers using app.get() but now things are separate, router is in another file. So, in order to bring router, we will use a middleware. Use app.use(). this is syntax

// routes declaration
app.use('/user', userRouter);   // control will be given to router in user.routes.js
// http://localhost:3000/user/register

// app.use('/api/v1/user', userRouter);
// http://localhost:3000/api/v1/user/register



export {app};


import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,    // fast searching
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,   // cloudinary url
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true, });

// pre hook in mongoose: do some work on data just before saving (read doc)
userSchema.pre("save", async function(next) {   // cryptographic algorithm takes time
    if (!this.isModified("password"))   return next();
    // run this code only when password field is modified, not others
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// don't use arrow function, it does not know context(no this). Save event is taking place on User (refers to current User document)
// 10 = salt rounds

// custom methods
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);
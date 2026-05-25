// design your own middleware to log out

import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

// verifies if user is present or not, while logging out
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized Request!");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // discuss about frontend
    if (!user) throw new ApiError(401, "Invalid Access Token!");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token!");
  }
});

/*
when you logged in user, you gave it access and refresh tokens,
on the basis of which you will verify that present user has
correct tokens or not (true login). your strategy is to
add a new object req.body which is req.user
 */

// https://www.jwt.io/introduction#how-json-web-tokens-work

// export const verifyJWT = asyncHandler(async (req, _, next) => {  // when res is not used, can be replaced by underscore
// }

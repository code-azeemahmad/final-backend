// to build logic, write more and more controllers
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js"; // contacts directly to db
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// no need of asyncHandler as we are not handling web requests
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // save in db
    await user.save({ validateBeforeSave: false }); // mongoose user model password field is triggered

    return { accessToken, refreshToken };
  } catch (error) {
    // console.log("TOKEN ERROR:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend, postman
  // validations - !empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary: avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullname, username, email, password } = req.body;
  // console.log("Email:", email);

  // if (fullname === "") {
  //     throw new ApiError(400, "fullname is required", )
  // }
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "") // handle files using middleware
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) throw new ApiError(409, "User already Exists");
  // console.log(req.files);

  // multer gives access to files
  const avatarLocalPath = req.files?.avatar[0]?.path; // clg(req.files)
  // const coverImageLocalPath = req.files?.coverImage[0]?.path; // TypeError: Cannot read properties of undefined (reading '0')
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar is required!");

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // handle edge cases
    password,
  });

  // check if user is truly created
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  // username or email
  // find the user
  // password check
  // generate access and refresh tokens
  // send secure cookies

  const { username, email, password } = req.body; // req.body contains: data sent by frontend/client

  if (!(username || email))
    throw new ApiError(400, "Username or Password is required!");

  // user is actual database document
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiError(400, "User does not exist!");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Password is incorrect");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User has been successfully logged in!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out successfully"));
});

// refresh the AccessToken end point
const refreshAccessToken = asyncHandler(async (res, req) => {
  try {
    const incomingRefreshToken =
      req.cookie.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized Request!");

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid Refresh Token!");

    if (incomingRefreshToken !== user?.refreshToken)
      throw new ApiError(401, "Refresh Token is expired or used");

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // auth middleware -> req.user
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current user is fetched successfullly")
    );
});

// make separate end points for user files updation to avoid network congestion
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new ApiError(400, "All fields are required!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email: email, // inconsistency to make you know that you can also write in this way
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url) throw new ApiError(400, "Error while uploading on cloudinary");

  const updatedAvatar = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
      avatar: avatar.url,
    }
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAvatar, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) throw new ApiError(400, "Cover Image file is missing");

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage?.url) throw new ApiError(400, "Error while uploading on cloudinary");

  const updatedCoverImage = await User.findByIdAndUpdate(
    req.user?._id,
    {
   $set: {
      coverImage: coverImage.url
   }
},
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCoverImage, "Cover Image updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};


/*_________________________________
| Method | Meaning                 |
| ------ | ----------------------- |
| PUT    | Replace ENTIRE resource |
| PATCH  | Update PARTIAL resource |
|________|_________________________|
*/
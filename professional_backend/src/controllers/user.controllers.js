// to build logic, write more and more controllers
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";  // contacts directly to db
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  const { fullname, username, email, avatar, password, coverImage } = req.body;
  console.log("Email:", email);
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

  // multer gives access to files
  const avatarLocalPath = req.files?.avatar[0]?.path; // clg(req.files)
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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
  const createdUser = await User.findById(user._id)
  .select(
    "-password -refreshToken"
  );

  if (!createdUser) throw new ApiError(500, "Something went wrong while registering the user");

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully"),
  )

});

export { registerUser };

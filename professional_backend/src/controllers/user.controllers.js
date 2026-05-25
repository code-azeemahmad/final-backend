// to build logic, write more and more controllers
import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser = asyncHandler( async(req, res) => {
    res.status(200).json({
        message: "Ok",
    });
});

export {registerUser};
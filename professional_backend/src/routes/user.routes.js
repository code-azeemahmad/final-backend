import { Router } from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(
    // inject middlewares
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        }
    ]),
    registerUser
);   // here control will be given to registerUser method

router.route('/login').post(loginUser);

// secured routes
router.route('/logout').post(verifyJWT, logoutUser)

export default router;  // default export
// export {router};    // named export
import { Router } from 'express';
import {registerUser} from '../controllers/user.controllers.js';

const router = Router();

router.route('/register').post(registerUser);   // here control will be given to registerUser method


export default router;  // default export
// export {router};    // named export
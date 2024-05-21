const express = require('express');
import { signin, signup } from '../controllers/authContoller';


const router = express.Router();

// Create User
router.post('/signup', signup)

// Sign
router.post('/signin',signin)

export const authRoute = router;
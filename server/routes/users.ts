const express = require('express');
import { getLeaderBoard, getUser } from '../controllers/userController';
import { verifyToken } from '../middlewares/verifyToken';


const router = express.Router();

// Get User Detail
router.get('/find/:nickname', verifyToken, getUser);

// Get Leaderboard
router.get('/leaderboard', verifyToken, getLeaderBoard);


export const userRoute = router;
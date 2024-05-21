import User from "../models/User";
import { createError } from "../middlewares/errorHandling";
import { responseTypes } from "../utils/types";

export type UpdatePlayer = {
    nickname: string;
    isWinner: boolean;
    matchScore: number;
}

export const updatePlayer = async (data : UpdatePlayer) => {
  try {
    const user = await User.findOne({ nickname : data.nickname });
    if(!user) {
        createError(404, responseTypes.UserNotFound.toLocaleString());
    } else {
        if(data.isWinner) {
            user.gamePlayed += 1;
            user.gameWon += 1;
            user.score += data.matchScore;
        } else {
            user.gamePlayed += 1;
            user.gameLost += 1;
        }   

        user.rank = getRank(user.score);
        await user.save();
    }
  } catch (err) {
    console.log("err", err);
    createError(500, 'Internal Server Error! Please try again later.');
  }
};

export const getRank = (score: number) => {
    if(score < 100) {
        return 'Beginner';
    } else if(score < 200) {
        return 'Novice';
    } else if(score < 350) {
        return 'Okay';
    } else if(score < 600) {
        return 'Good';
    } else if(score < 1100) {
        return 'Solid';
    } else if(score < 2100) {
        return 'Nice';
    } else if(score < 4250) {
        return 'Great';
    } else if(score < 7500) {
        return 'Amazing';
    } else if(score < 10000) {
        return 'Genius';
    } else {
        return 'Master';
    }
}

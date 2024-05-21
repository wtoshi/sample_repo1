import { createError } from "../middlewares/errorHandling";
import User from "../models/User";
import { LeaderBoardPlayerItem, Player } from "../utils/types/index";

export const getUser = async (req : any, res: any, next: any) => {
  try {
    // await testWaiter(req, res, next);

    const user = await User.findOne({ nickname: req.params.nickname });

    if (!user) {
      return createError(404, "User not found");
    }

    const resPlayer: Player = {
      id: user._id.toString(),
      nickname: user.nickname,
      avatar: user.avatar,
      gamePlayed: user.gamePlayed,
      gameWon: user.gameWon,
      gameLost: user.gameLost,
      score: user.score,
      rank: user.rank,
    };

    res.status(200).json(resPlayer);
  } catch (err) {
    next(err);
  }
};

export const getLeaderBoard = async (req: any, res: any, next: any) => {
  try {
    //await testWaiter(req, res, next);

    const users = await User.find().sort({ score: -1 }).limit(10); // Skoru en yüksek olan 10 kullanıcıyı getir

    if (!users) {
      return createError(404, "User not found");
    }

    const leaderBoardUsers: LeaderBoardPlayerItem[] = users.map(
      (user, index) => ({
        place: index + 1,
        nickname: user.nickname,
        avatar: user.avatar,
        score: user.score,
      })
    );

    res.status(200).json(leaderBoardUsers);
  } catch (err) {
    next(err);
  }
};

const testWaiter = async (req: any, res: any, next: any) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    res.status(200).send("OK");
  } catch (err) {
    next(err);
  }
};

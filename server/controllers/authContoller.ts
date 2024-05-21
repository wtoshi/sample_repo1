import mongoose = require("mongoose");
import bcrypt = require("bcryptjs");
import User from "../models/User";
import { createError } from "../middlewares/errorHandling";
import { sign } from "jsonwebtoken";
import { responseTypes } from "../utils/types";
import dotenv from 'dotenv';


dotenv.config();

export const signup = async (req : any, res: any, next: any) => {
  try {
    const nickname = req.body.nickname;

    // Nickname uzunluğunu kontrol et
    if (!nickname || nickname.length < 3 || nickname.length > 20) {
      return res.status(400).json({
        message: "Nickname must be between 3 and 20 characters.",
        fieldErrors: {
          nickname: responseTypes.NicknameLength.toLocaleString()
        },
      });
    }

    var hasNickname = await checkIfNicknameExists(nickname); // Daha önce kullanılmayan bir nickname olup olmadığını kontrol et

    if (hasNickname) {
      return res.status(400).json({
        message: responseTypes.HasUser.toLocaleString(),
        fieldErrors: {
          nickname: responseTypes.HasUser.toLocaleString(),
        },
      });
    }

    const salt = bcrypt.genSaltSync(10);

    const passHash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: passHash });

    await newUser.save();

    res.status(200).send(responseTypes.UserCreated.toLocaleString());
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

export const signin = async (req: any, res: any, next: any) => {
  try {
    const user = await User.findOne({ nickname: req.body.nickname });

    if (!user) {
      return res.status(404).json({
        message: responseTypes.UserNotFound.toLocaleString(),
        fieldErrors: {
          nickname: responseTypes.UserNotFound.toLocaleString(),
        },
      });
    }

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) {
      return res.status(400).json({
        message: responseTypes.PasswordWrong.toLocaleString(),
        fieldErrors: {
          password: responseTypes.PasswordWrong.toLocaleString(),
        },
      });
    }

    const token = sign({ id: user._id }, process.env.JWT_TOKEN!);

    const { password, ...otherDetails } = user.toObject();

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false, // Sadece HTTPS üzerinden iletilmesini sağlar
        //sameSite: "Strict", // Tarayıcının sadece aynı siteye olan isteklerde cookie'yi göndermesini sağlar
        // domain: 'example.com', // Opsiyonel: Belirli bir etki alanı için cookie oluşturmak istiyorsanız
        // path: '/', // Opsiyonel: Cookie'nin hangi yollar için geçerli olacağını belirtir
        // expires: new Date(Date.now() + 3600000), // Opsiyonel: Cookie'nin ne zaman sona ereceğini belirtir (örnekte 1 saat)
        // maxAge: 3600000, // Opsiyonel: Cookie'nin ne kadar süreyle geçerli olacağını belirtir (örnekte 1 saat)
      })
      .status(200)
      .json({ token: token, user: otherDetails });
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

const checkIfNicknameExists = async (nickname: any) => {
  try {
    const user = await User.findOne({ nickname });
    return !!user;
  } catch (error) {
    console.error("MongoDB sorgusu hatası:", error);
    return false;
  }
};

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
// interfaces
import Iuser from "../interfaces/user";
// models
import User from "../models/user";
// utils
import signJWT from "../utils/signJWT";

const validateToken = (req: Request, res: Response) => {
  console.info("Token validated, user authorized");
  return res
    .status(200)
    .json({ success: true, message: "Token validated, user authorized." });
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, users, count: users.length });
  } catch (error: any) {
    const { message } = error;
    console.error(message, error);
    res.json({ success: false, message, error });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    const { message } = error;
    console.error(message, error);
    res.json({ success: false, message, error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params, req.body, {
      new: true,
    }).select("-password");
    res.send(200).json({ success: true, user });
  } catch (error: any) {
    const { message } = error;
    console.error(message, error);
    res.status(500).json({ success: false, message, error });
  }
};

const login = async (req: Request, res: Response) => {
  let { username, password } = req.body as Iuser;

  try {
    const user = await User.findOne({ username }).exec();

    if (user) {
      const isAuth = await bcrypt.compare(password, user.password);

      if (isAuth) {
        signJWT(user, (error, token) => {
          if (error) res.json({ success: false, message: "Unauthorized" });
          if (token) res.status(200).json({ success: true, token });
        });
      } else {
        res.json({ success: false, message: "Unauthorized" });
      }
    } else {
      res.json({ success: false, message: "User not found." });
    }
  } catch (error: any) {
    const { message } = error;
    console.error(message, error);
    res.status(400).json({ success: false, message, error });
  }
};

const register = async (req: Request, res: Response) => {
  let { username, password } = req.body as Iuser;

  const exists = await User.findOne({ username }).exec();

  if (exists) {
    return res.json({ success: false, message: "Username already in use." });
  } else {
    bcrypt.hash(password, 10, (hashError, hash) => {
      if (hashError) {
        return res.json({
          success: false,
          message: hashError.message,
          error: hashError,
        });
      }

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password: hash,
      });

      return newUser
        .save()
        .then((user) => res.status(201).json({ success: true }))
        .catch((error) =>
          res.json({ success: false, message: error.message, error })
        );
    });
  }
};

const controller = { getUsers, getUser, register, login, validateToken };

export default controller;

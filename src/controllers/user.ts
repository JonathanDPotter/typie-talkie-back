import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose, { Error } from "mongoose";
// interfaces
import Iuser from "../interfaces/user";
// models
import User from "../models/user";
// utils
import signJWT from "../utils/signJWT";

const validateToken = (req: Request, res: Response) => {
  console.info("Token validated, user authorized");
  res.status(200).json({ message: "Token validated, user authorized." });
  return;
};

// returns all user records without the password
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users, count: users.length });
    return;
  } catch (error: any) {
    const { message } = error as Error;
    console.error(message, error);
    res.status(500).json({ message });
  }
};

// returns a single user record without the password
const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params).select("-password");
    res.status(200).json({ user });
    return;
  } catch (error: any) {
    const { message } = error as Error;
    console.error(message, error);
    res.status(500).json({ message });
    return;
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params, req.body, {
      new: true,
    }).select("-password");
    res.send(200).json({ user });
    return;
  } catch (error: any) {
    const { message } = error as Error;
    console.error(message, error);
    res.status(500).json({ message });
    return;
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
          if (error) res.status(500).json({ message: error.message });
          if (token) res.status(200).json({ token });
          return;
        });
      } else {
        res.status(401).json({ message: "Password is incorrect" });
        return;
      }
    } else {
      res.status(500).json({ message: "User not found." });
      return;
    }
  } catch (error: any) {
    const { message } = error as Error;
    console.error(message, error);
    res.status(500).json({ message });
    return;
  }
};

const register = async (req: Request, res: Response) => {
  let { username, password } = req.body as Iuser;

  const exists = await User.findOne({ username }).exec();

  if (exists) {
    res.json({ message: "Username already in use." });
    return;
  }
  bcrypt.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      res.json({
        message: hashError.message,
        error: hashError,
      });
      return;
    }

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password: hash,
    });

    newUser
      .save()
      .then(() => res.status(201).json({ success: true }))
      .catch((error) =>
        res.status(500).json({ message: error.message, error })
      );
    return;
  });
};

const controller = {
  getUsers,
  getUser,
  register,
  login,
  validateToken,
  updateUser,
};

export default controller;

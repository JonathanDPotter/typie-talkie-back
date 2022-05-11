import { Schema, model } from "mongoose";
import ImongoUser from "../interfaces/mongoUser";

const userSchema = new Schema({
  username: String,
  password: String,
  socket: { type: String, required: false },
});

const User = model<ImongoUser>("User", userSchema);

export default User;

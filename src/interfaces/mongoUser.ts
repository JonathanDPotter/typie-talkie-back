import { Document } from "mongoose";

export default interface ImongoUser extends Document {
  username: string;
  password: string;
}

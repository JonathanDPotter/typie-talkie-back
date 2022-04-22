import mongoose from "mongoose";
import config from "../config";

const mongo = async () => {
  try {
    await mongoose.connect(config.MONGO.url, config.MONGO.options);
    console.info(`Connected to ${config.MONGO.collection} at mongodb.`);
  } catch (error) {
    console.error("Could not connect to database.");
    process.exit(1);
  }
};

export default mongo;

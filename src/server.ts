import express from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { Server } from "socket.io";
// utils
import socket from "./socket";
// config
import config from "./config";
// routes
import indexRoutes from "./routes";

const { port, hostname } = config.SERVER;
const { url, options, collection } = config.MONGO;

// create app, server and io socket
const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// set server to listen on designated port
server.listen(port, () => {
  console.log(`Server listening on: ${hostname}:${port}`);

  // connect to mongoose
  // mongoose.connect(url, options, () =>
  //   console.log(`Connected to mongodb collection ${collection}`)
  // );

  socket({ io });

  // parse requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // logging with morgan
  app.use(morgan("dev"));

  //routes
  app.use("/", indexRoutes);
});

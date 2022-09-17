import express from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
// utils
import socket from "./utils/socket";
import mongo from "./utils/mongo";
// config
import config from "./config";
// routes
import indexRoutes from "./routes";
import userRoutes from "./routes/user";

const { port, hostname } = config.SERVER;
const { url, options, collection } = config.MONGO;

// create app, server and io socket
const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://typie-talkie-front-2o6l8rlh6-jonathandpotter.vercel.app/",
    credentials: true,
  },
});

// set server to listen on designated port
server.listen(port, async () => {
  console.log(`Server listening on: ${hostname}:${port}`);

  // connect to mongoose
  await mongo();

  // connect to websockets
  socket({ io });

  // parse requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // logging with morgan
  app.use(morgan("dev"));

  // cors setup
  app.use(
    cors({
      origin: "https://typie-talkie-front-fcyl99l4c-jonathandpotter.vercel.app",
      credentials: true,
    })
  );

  //routes
  app.use("/", indexRoutes);
  app.use("/api/user", userRoutes);
});

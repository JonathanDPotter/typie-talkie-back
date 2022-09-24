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

// create app, server and io socket
const app = express();

const server = createServer(app);

const corsOptions = {
  origin: "https://typie-talkie-front.vercel.app/",
  credentials: true,
  preflight: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

// set server to listen on designated port
server.listen(port, async () => {
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
  app.use(cors(corsOptions));

  //routes
  app.use("/", indexRoutes);
  app.use("/api/user", userRoutes);

  console.log(`Server listening on: ${hostname}:${port}`);
  console.log(`Allowed Origin: ${corsOptions.origin}`);
});

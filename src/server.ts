import express from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { Server } from "socket.io";
// config
import config from "./config";
// routes
import indexRoutes from "./routes";

const { port } = config.SERVER;
const { url, options, collection } = config.MONGO;

// create app, server and io socket
const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["typie"],
  },
});

// socket stuff
io.on("connection", (socket) => {
  console.log("client connected:", socket.id);
  socket.emit("welcome", socket.id);
});

// set server to listen on designated port
server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);

  // connect to mongoose
  mongoose.connect(url, options, () =>
    console.log(`Connected to mongodb collection ${collection}`)
  );

  // cors setup
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
    })
  );

  // parse requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // logging with morgan
  app.use(morgan("dev"));

  //routes
  app.use("/", indexRoutes);
});

import { Server, Socket } from "socket.io";

const EVENTS = {
  connection: "connection",
  message: "message",
};

function socket({ io }: { io: Server }) {
  console.log(`Sockets enabled.`);

  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`User connected ${socket.id}`);
    socket.emit("connection", {
      name: "Server",
      message: "Welcome to typie-talkie",
    });
    socket.broadcast.emit("connection", {
      name: "Server",
      message: `${socket.id} connected.`
    })
    socket.on("message", (data) => {
      socket.broadcast.emit("message", data);
    });
  });
}

export default socket;

import { Server, Socket } from "socket.io";

const EVENTS = {
  connection: "connection",
  message: "message",
  disconnected: "disconnected",
};

function socket({ io }: { io: Server }) {
  console.log(`Sockets enabled.`);

  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`User connected to socket ${socket.id}`);
    socket.emit("connection", {
      name: "Server",
      message: "Welcome to typie-talkie",
    });

    socket.on("new", (data) => {
      socket.broadcast.emit(EVENTS.message, {
        name: "Server",
        message: `${data.name} has connected.`,
      });
    });

    socket.on(EVENTS.message, (data) => {
      socket.broadcast.emit(EVENTS.message, data);
    });

    socket.on(EVENTS.disconnected, ({ name }) => {
      socket.broadcast.emit(EVENTS.message, {
        name: "Server",
        message: `${name} has disconnected.`,
      });
    });
  });
}

export default socket;

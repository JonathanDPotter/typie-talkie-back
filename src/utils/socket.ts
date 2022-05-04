import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";
import User from "../models/user";

interface Idata {
  name: string;
  message?: string;
}

const EVENTS = {
  connection: "connection",
  message: "message",
  disconnected: "disconnected",
  userDisconnected: "user-disconnected",
  new: "new",
};

function socket({ io }: { io: Server }) {
  console.log(`Sockets enabled.`);

  io.on(EVENTS.connection, async (socket: Socket) => {
    console.log(`User connected to socket ${socket.id}`);

    const sendCurrentUsers = async (data: Idata) => {
      await User.findOneAndUpdate(
        { username: data.name },
        { socket: socket.id },
        { new: true }
      ).select("-password");

      // get all socket objects
      const sockets = await io.fetchSockets();

      // fill the socketIds array with the IDs of each socket
      const socketIds: string[] = [];

      for (const sckt of sockets) {
        socketIds.push(sckt.id);
      }

      // getUsers function returns an array of all of the active users usernames
      const getUsers = async () => {
        const users = Promise.all(
          socketIds.map((socket) => {
            const result = User.findOne({ socket })
              .exec()
              .then((doc) => doc);
            return result;
          })
        );

        const userNames = await users.then((arr) =>
          arr.map((doc) => doc?.username)
        );

        return userNames;
      };

      const users = await getUsers().then((arr) => arr);

      io.emit(EVENTS.new, { users });
    };

    socket.on(EVENTS.new, async (data) => {
      socket.broadcast.emit(EVENTS.message, {
        name: "Server",
        message: `${data.name} has connected.`,
        id: uuid(),
      });
      sendCurrentUsers(data);
    });

    socket.on(EVENTS.message, (data) => {
      socket.broadcast.emit(EVENTS.message, { ...data, id: uuid() });
    });

    socket.on(EVENTS.disconnected, (data) => {
      socket.broadcast.emit(EVENTS.message, {
        name: "Server",
        message: `${data?.name} has disconnected.`,
        id: uuid(),
      });
      sendCurrentUsers(data);
    });
  });
}

export default socket;

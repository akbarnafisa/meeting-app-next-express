import { Server } from "socket.io";

const initSocket = (io: Server) => {
  console.log(3333)
  io.on("connection", (socket) => {
    io.emit("user_connect", `user join the chat!`);
    console.log(123)

    socket.on("disconnect", () => {
      io.emit("user_disconnect", `user left the chat!`);
    });
  });
};

export default initSocket;

import { Server } from "socket.io";
import {
  createSocketRoom,
  insertSocketUser,
  queryUserBySocketId,
  queryUsersByRoomId,
  removeUserByUserId,
} from "../service/socket";
import { ICreateRoom, IJoinRoom } from "../interface";

const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("init connection");

    socket.on("create-new-room", async (payload: ICreateRoom) => {
      const socketRoom = await createSocketRoom();

      await insertSocketUser({
        name: payload.meetingName,
        roomId: socketRoom.roomId,
        socketId: socket.id,
        isHostRoom: payload.isHostMeeting,
      });

      socket.join(socketRoom.roomId);

      socket.emit("room-id", {
        success: true,
        socketId: socket.id,
        roomId: socketRoom.roomId,
      });

      const connectedUsers = await queryUsersByRoomId(socketRoom.roomId);

      socket.emit("room-users", {
        connectedUsers,
      });
    });

    socket.on("join-room", async (payload: IJoinRoom) => {
      await insertSocketUser({
        name: payload.meetingName,
        roomId: payload.meetingId,
        socketId: socket.id,
      });

      socket.join(payload.meetingId);

      socket.emit("room-id", {
        success: true,
        socketId: socket.id,
        roomId: payload.meetingId,
      });

      const connectedUsers = await queryUsersByRoomId(payload.meetingId);

      // for each connected user other than current user, prepare new connection for them
      connectedUsers.forEach((user) => {
        if (user.socketId !== socket.id) {
          const payload = { connectedUserSocketId: socket.id };

          io.to(user.socketId).emit("connection-prepare", payload);
        }
      });

      io.in(payload.meetingId).emit("room-users", {
        connectedUsers,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("connection-signal", async (payload: any) => {
      const signalingData = {
        signal: payload.signal,
        connectedUserSocketId: socket.id,
      };

      io.to(payload.connectedUserSocketId).emit(
        "connection-signal",
        signalingData
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("connection-init", async (payload: any) => {
      const initData = {
        connectedUserSocketId: socket.id,
      };

      io.to(payload.connectedUserSocketId).emit("connection-init", initData);
    });

    socket.on("disconnect", async () => {
      const getUser = await queryUserBySocketId(socket.id);

      console.log("disconnected socket", getUser);

      if (getUser) {
        await removeUserByUserId(getUser.userId);

        socket.leave(getUser.roomId);

        const connectedUsers = await queryUsersByRoomId(getUser.roomId);

        io.to(getUser.roomId).emit("user-disconnected", {
          socketId: socket.id,
        });

        io.to(getUser.roomId).emit("room-users", {
          connectedUsers,
        });
      }
    });
  });
};

export default initSocket;

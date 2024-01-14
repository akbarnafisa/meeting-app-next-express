import { Server } from "socket.io";
import {
  createSocketRoom,
  insertSocketUser,
  queryUserBySocketId,
  queryUsersByRoomId,
  removeUserByUserId,
} from "../service/socket";
import { ICreateRoom } from "../interface";

const initSocket = (io: Server) => {
  io.on("connection", (socket) => {

    console.log('init connection')
    
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

      console.log("create-new-room", {
        roomId: {
          success: true,
          socketId: socket.id,
          roomId: socketRoom.roomId,
        },
        roomUsers: {
          connectedUsers,
        },
      });
    });

    socket.on("disconnect", async () => {
      const getUser = await queryUserBySocketId(socket.id);

      console.log('disconnected socket', getUser)

      if (getUser) {
        await removeUserByUserId(getUser.userId);

        socket.leave(getUser.roomId);

        const connectedUsers = await queryUsersByRoomId(getUser.roomId);

        io.volatile.to(getUser.roomId).emit("user-disconnected", {
          socketId: socket.id,
        });

        io.volatile.to(getUser.roomId).emit("room-users", {
          connectedUsers,
        });
      }
    });
  });
};

export default initSocket;

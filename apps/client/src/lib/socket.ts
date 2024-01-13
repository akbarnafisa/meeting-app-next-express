import { Socket } from "socket.io-client";

import { IMeetingConfig } from "@/interface/room";
import { IRoomStore } from "@/store";

let socket: Socket | null = null;

export const connectSocketIoServer = (
  socket: Socket,
  roomStore: IRoomStore
) => {
  socket?.volatile.on("user_connect", (data: any) => {
    console.log("user_connect", data);
  });

  socket?.volatile.on("user_disconnect", (data: any) => {
    console.log("user_disconnect", data);
  });
};

export const createNewRoom = (socket: Socket, meetingConfig: IMeetingConfig) => {
  const data = {
    meetingName: meetingConfig.meetingName,
    isHostMeeting: meetingConfig.isHostMeeting,
  };

  socket?.volatile.emit("create-new-room", data);
};

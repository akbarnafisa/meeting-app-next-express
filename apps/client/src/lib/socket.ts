import { Socket } from "socket.io-client";

import { IMeetingConfig } from "@/interface/room";
import { IRoomStore } from "@/store";
import { removePeerConnection } from "./rtc-handler";

export const connectSocketIoServer = (
  socket: Socket,
  roomStore: IRoomStore
) => {
  socket.on("connect", () => {
    console.log("connected", socket.id);
    roomStore.setSocketId(socket?.id as string);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  socket?.volatile.on("room-id", (data: any) => {
    console.log("roomId", {
      data,
    });
    roomStore.setRoomId(data.roomId);
  });

  socket?.volatile.on("room-users", (data: any) => {
    console.log("roomUsers", {
      data,
    });
    roomStore.setMeetingUsers(data.connectedUsers);
  });

  // socket?.volatile.on('connection-prepare', (data: any) => {
  //   prepareNewPeerConnection(data.connectedUserSocketId, false)

  //   socket?.volatile.emit('connection-init', { connectedUserSocketId: data.connectedUserSocketId })
  // })

  // socket?.volatile.on('connection-signal', (data: any) => {
  //   handleSignalingData(data)
  // })

  // socket?.volatile.on('connection-init', (data: any) => {
  //   prepareNewPeerConnection(data.connectedUserSocketId, true)
  // })

  socket?.volatile.on('user-disconnected', (data: any) => {
    removePeerConnection(data)
  })
};

export const createNewRoom = (
  socket: Socket,
  meetingConfig: IMeetingConfig
) => {
  const data = {
    meetingName: meetingConfig.meetingName,
    isHostMeeting: meetingConfig.isHostMeeting,
  };

  console.log("createNewRoom", data);

  socket?.volatile.emit("create-new-room", data);
};

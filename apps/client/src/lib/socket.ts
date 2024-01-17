import { Socket } from "socket.io-client";

import { IMeetingConfig } from "@/interface/room";
import { IRoomStore } from "@/store";
import {
  handleSignalingData,
  prepareNewPeerConnection,
  removeLocalStream,
  removePeerConnection,
} from "./rtc-handler";

export const connectSocketIoServer = (
  socket: Socket,
  roomStore: IRoomStore
) => {
  socket.on("connect", () => {
    roomStore.setSocketId(socket?.id as string);
  });

  socket?.volatile.on("room-id", (data: any) => {
    roomStore.setRoomId(data.roomId);
  });

  socket?.volatile.on("room-users", (data: any) => {
    roomStore.setMeetingUsers(data.connectedUsers);
  });

  socket?.volatile.on("connection-prepare", (data: any) => {
    // setup the responder
    prepareNewPeerConnection(data.connectedUserSocketId, false, socket);

    // set
    socket?.volatile.emit("connection-init", {
      connectedUserSocketId: data.connectedUserSocketId,
    });
  });

  socket?.volatile.on("connection-signal", (data: any) => {
    handleSignalingData(data);
  });

  socket?.volatile.on("connection-init", (data: any) => {
    prepareNewPeerConnection(data.connectedUserSocketId, true, socket);
  });

  socket?.volatile.on("user-disconnected", (data: any) => {
    removePeerConnection(data);
  });
};

export const createNewRoom = (
  socket: Socket,
  meetingConfig: IMeetingConfig
) => {
  const data = {
    meetingName: meetingConfig.meetingName,
    isHostMeeting: meetingConfig.isHostMeeting,
  };

  socket?.volatile.emit("create-new-room", data);
};

export const joinRoom = (socket: Socket, meetingConfig: IMeetingConfig) => {
  const data = {
    meetingId: meetingConfig.meetingId,
    meetingName: meetingConfig.meetingName,
  };

  socket?.volatile.emit("join-room", data);
};

export const signalPeerData = (socket: Socket, data: any) => {
  socket?.volatile.emit("connection-signal", data);
};


export const disconnectSocketIoServer = (socket: Socket) => {
  removeLocalStream()
  socket?.volatile.disconnect()
}
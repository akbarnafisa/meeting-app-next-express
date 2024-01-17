import { IChatMessage, IMeetingConfig } from "@/interface/room";
import { createNewRoom, joinRoom, signalPeerData } from "./socket";
import { Socket } from "socket.io-client";
import type { SimplePeer } from "simple-peer";
// @ts-ignore
import Peer from "simple-peer/simplepeer.min.js";
import { setMessages } from "@/store";

let localStream: null | MediaStream = null;
let streams: any = [];

export const getLocalPreviewAndRoomConnection = async (
  config: IMeetingConfig,
  socketId: string,
  socket: Socket
) => {
  try {
    const mediaConstraints = getMediaConstraints(config.isConnectOnlyAudio);
    localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

    showVideoStream(localStream, socketId);

    config.isHostMeeting
      ? createNewRoom(socket, config)
      : joinRoom(socket, config);
  } catch (error) {
    console.error(error);
  }
};

const getMediaConstraints = (connectAudioOnly: boolean) => {
  return {
    audio: true,
    video: !connectAudioOnly,
  };
};

export const showVideoStream = (
  stream: MediaStream,
  connectedUserSocketId: string = ""
) => {
  const videosContainer = document.getElementById("videos_container");
  videosContainer?.classList.add("videos_container_styles");

  // container
  const videoContainer = document.createElement("div");
  videoContainer.classList.add("video_container_style");
  videoContainer.id = connectedUserSocketId;

  // video
  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.srcObject = stream;

  if (connectedUserSocketId) {
    videoElement.id = `${connectedUserSocketId}.video`;
  }
  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };

  videoContainer.appendChild(videoElement);
  videosContainer?.appendChild(videoContainer);
};

export const micToggle = (value: boolean) => {
  if (!localStream) return;

  localStream.getAudioTracks()[0].enabled = value;
};

export const videoToggle = (value: boolean) => {
  if (!localStream) return;

  localStream.getVideoTracks()[0].enabled = value;
};

let peers: Record<string, InstanceType<SimplePeer>> = {};

export const removePeerConnection = (data: any) => {
  const { socketId } = data;

  const videoContainer = document.getElementById(socketId);
  const videoElement = document.getElementById(`${socketId}.video`) as any;

  if (videoContainer && videoElement) {
    const tracks = videoElement.srcObject?.getTracks();
    tracks.forEach((t: any) => t.stop());

    videoElement.srcObject = null;
    videoContainer.removeChild(videoElement);
    videoContainer.parentNode?.removeChild(videoContainer);

    if (peers[socketId]) {
      peers[socketId].destroy();
      delete peers[socketId];
    }
  }
};

const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
};

const addStream = (stream: MediaStream, connectedUserSocketId: string) => {
  showVideoStream(stream, connectedUserSocketId);
};

export const concatNewMessage = (message: IChatMessage) => {
  setMessages(message);
};

export const prepareNewPeerConnection = (
  connectedUserSocketId: string,
  isInitiator: boolean,
  socket: Socket
) => {
  const configuration = getConfiguration();

  // handle one by one peer connection
  peers[connectedUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream as MediaStream,
  });

  // Signaling is the mechanism by which two peers create a WebRTC connection
  peers[connectedUserSocketId].on("signal", (data: any) => {
    console.log("signal", { data });
    const signalData = {
      signal: data,
      connectedUserSocketId: connectedUserSocketId,
    };
    signalPeerData(socket, signalData);
  });

  peers[connectedUserSocketId].on("connect", () => {
    console.log("CONNECT");
  });

  peers[connectedUserSocketId].on("stream", (stream: any) => {
    console.log("stream", { stream });
    addStream(stream, connectedUserSocketId);
    streams = [...streams, stream];
  });

  // Received files and, messages from peer
  peers[connectedUserSocketId].on("data", (data: string) => {
    console.log("peer-data", {
      data,
    });
    const messageData = JSON.parse(data);
    concatNewMessage(messageData);
  });
};

export const handleSignalingData = (data: any) => {
  console.log("handleSignalingData", data);
  peers[data.connectedUserSocketId].signal(data.signal);
};


export const sendMessageUsingDataChannel = (message: IChatMessage) => {
  concatNewMessage(message)

  const stringifyMessage = JSON.stringify(message)
  for (let socketId in peers) {
    peers[socketId].send(stringifyMessage)
  }
}

export const removeLocalStream = () => {
  localStream?.getAudioTracks()[0].stop()
  localStream?.getVideoTracks()[0].stop()
  localStream = null
}
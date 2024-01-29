import {
  IChatMessage,
  IGetDisplayMedia,
  IMeetingConfig,
} from "@/interface/room";
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
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    showVideoStream(localStream, socketId, true);

    config.isHostMeeting
      ? createNewRoom(socket, config)
      : joinRoom(socket, config);
  } catch (error) {
    console.error(error);
  }
};

export const showVideoStream = (
  stream: MediaStream,
  connectedUserSocketId: string = "",
  muteAudio: boolean
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
  videoElement.volume = muteAudio ? 0 : 1

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
    tracks.forEach((t: any) => t?.stop());

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
  showVideoStream(stream, connectedUserSocketId, false);
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
    const signalData = {
      signal: data,
      connectedUserSocketId: connectedUserSocketId,
    };
    signalPeerData(socket, signalData);
  });

  peers[connectedUserSocketId].on("stream", (stream: any) => {
    addStream(stream, connectedUserSocketId);
    streams = [...streams, stream];
  });

  // Received files and, messages from peer
  peers[connectedUserSocketId].on("data", (data: string) => {
    const messageData = JSON.parse(data);
    concatNewMessage(messageData);
  });
};

export const handleSignalingData = (data: any) => {
  peers[data.connectedUserSocketId].signal(data.signal);
};

export const sendMessageUsingDataChannel = (message: IChatMessage) => {
  concatNewMessage(message);

  const stringifyMessage = JSON.stringify(message);
  for (let socketId in peers) {
    peers[socketId].send(stringifyMessage);
  }
};

export const removeLocalStream = () => {
  localStream?.getAudioTracks()[0]?.stop();
  localStream?.getVideoTracks()[0]?.stop();
  localStream = null;
};

export const getDisplayMediaStream = async (): Promise<IGetDisplayMedia> => {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true,
    });

    return {
      success: true,
      stream,
    };
  } catch (err) {
    const message = `Error occurred when get an access to screen share: ${err}`;
    console.log(message);

    return {
      success: false,
      errorMessage: message,
    };
  }
};

export const screenShareToogle = (
  isScreenSharingActive: boolean,
  screenSharingStream: MediaStream | null = null
) => {
  if (isScreenSharingActive) {
    switchVideoTracks(screenSharingStream);
  } else {
    switchVideoTracks(localStream);
  }
};

const switchVideoTracks = (stream: MediaStream | null) => {
  for (let socket_id in peers) {
    for (let peerIdTrack in peers[socket_id].streams[0].getTracks()) {
      // track from share screen, looping through audio and video track
      for (let track in stream?.getTracks() as MediaStreamTrack[]) {
        // replace the video track stream
        if (
          peers[socket_id].streams[0].getTracks()[peerIdTrack].kind ===
          stream?.getTracks()[track].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[peerIdTrack],
            stream?.getTracks()[track],
            peers[socket_id].streams[0]
          );
          break;
        }
      }
    }
  }
};

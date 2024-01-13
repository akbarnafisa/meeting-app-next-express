import { IMeetingConfig } from "@/interface/room";
import { createNewRoom } from "./socket";
import { Socket } from "socket.io-client";

let localStream: null | MediaStream = null;

export const getLocalPreviewAndRoomConnection = async (
  config: IMeetingConfig,
  socketId: string,
  socket: Socket
) => {
  try {
    const mediaConstraints = getMediaConstraints(config.isConnectOnlyAudio);
    localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

    showVideoStream(localStream, socketId);

    createNewRoom(socket, config);

    // config.isHostMeeting
    // ? createNewRoom(config)
    // : joinRoom(config)
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

  // Participant
  const videoContainer = document.createElement("div");
  videoContainer.classList.add("video_container_style");
  videoContainer.id = connectedUserSocketId;

  // User
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

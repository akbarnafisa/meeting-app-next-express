import { IRoomState, ISetMeetingConfig } from "@/interface/room";
import { micToggle, videoToggle } from "@/lib/rtc-handler";
import { create } from "zustand";

type Action = {
  setMeetingConfig: (config: ISetMeetingConfig) => void;
  setIsInitiateRoom: (value: boolean) => void;
  setVideo: () => void;
  setMicrophone: () => void;
};

// Create your store, which includes both state and (optionally) actions
const useRoomStore = create<IRoomState & Action>((set) => ({
  isHostMeeting: false,
  meetingName: "",
  roomId: "",
  isConnectOnlyAudio: false,
  isInitiateRoom: false,
  isMicrophoneActive: false,
  isVideoActive: false,
  socketId: "",

  setMeetingConfig: (config) => {
    set(() => ({
      isConnectOnlyAudio: config.isConnectOnlyAudio,
      isHostMeeting: config.isHostMeeting,
      meetingName: config.meetingName,
      roomId: config.meetingId,
    }));
  },

  setIsInitiateRoom: (value: boolean) => {
    set(() => ({
      isInitiateRoom: value,
    }));
  },

  setMicrophone: () => {
    set((state) => {
      micToggle(!state.isInitiateRoom);
      return {
        isInitiateRoom: !state.isInitiateRoom,
      };
    });
  },

  setVideo: () => {
    set((state) => {
      videoToggle(!state.isVideoActive);
      return {
        isVideoActive: !state.isVideoActive,
      };
    });
  },
}));

export default useRoomStore;

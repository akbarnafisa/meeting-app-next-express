import { IRoomState, ISetMeetingConfig } from "@/interface/room";
import { create } from "zustand";

type Action = {
  setMeetingConfig: (config: ISetMeetingConfig) => void;
};

// Create your store, which includes both state and (optionally) actions
const useRoomStore = create<IRoomState & Action>((set) => ({
  isHostMeeting: false,
  meetingName: "",
  roomId: "",
  isConnectOnlyAudio: false,

  setMeetingConfig: (config) => {
    set(() => ({
      isConnectOnlyAudio: config.isConnectOnlyAudio,
      isHostMeeting: config.isHostMeeting,
      meetingName: config.meetingName,
      roomId: config.meetingId,
    }));
  },
}));

export default useRoomStore;

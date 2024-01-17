import { IChatMessage, IRoomState, ISetMeetingConfig } from "@/interface/room";
import { micToggle, videoToggle } from "@/lib/rtc-handler";
import { create } from "zustand";

type Action = {
  setMeetingConfig: (config: ISetMeetingConfig) => void;
  setIsInitiateRoom: (value: boolean) => void;
  setVideo: () => void;
  setMicrophone: () => void;
  setSocketId: (value: string) => void;
  setRoomId: (value: string) => void;
  setMeetingUsers: (value: any) => void;
  setIsShowParticipants: () => void;
  setIsShowChatRoom: () => void;
  setShareScreen: () => void;
  resetToDefaultState: () => void;
};

const DEFAULT_STORE = {
  isHostMeeting: false,
  meetingName: "",
  roomId: "",
  isConnectOnlyAudio: false,
  isInitiateRoom: false,
  isMicrophoneActive: false,
  isVideoActive: false,
  isShowParticipants: false,
  isShareScreenActive: false,
  isShowChatRoom: false,
  socketId: "",
  meetingUsers: [],
  messages: [],
};

// Create your store, which includes both state and (optionally) actions
const useRoomStore = create<IRoomState & Action>((set) => ({
  ...DEFAULT_STORE,

  resetToDefaultState: () => {
    set(DEFAULT_STORE);
  },

  setSocketId: (value: string) => {
    set(() => ({
      socketId: value,
    }));
  },

  setRoomId: (value: string) => {
    set(() => ({
      roomId: value,
    }));
  },

  setMeetingUsers: (value: any) => {
    set(() => ({
      meetingUsers: value,
    }));
  },

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
      micToggle(!state.isMicrophoneActive);
      return {
        isMicrophoneActive: !state.isMicrophoneActive,
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

  setIsShowParticipants: () => {
    set((state) => {
      return {
        isShowParticipants: !state.isShowParticipants,
      };
    });
  },

  setIsShowChatRoom: () => {
    set((state) => {
      return {
        isShowChatRoom: !state.isShowChatRoom,
      };
    });
  },

  setShareScreen: () => {
    set((state) => {
      return {
        isShareScreenActive: !state.isShareScreenActive,
      };
    });
  },
}));

export type IRoomStore = IRoomState & Action;

export const setMessages = (messages: IChatMessage) =>
  useRoomStore.setState({
    messages: [...useRoomStore.getState().messages, messages],
  });

export default useRoomStore;

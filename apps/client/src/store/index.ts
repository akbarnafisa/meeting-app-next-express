import { IChatMessage, IRoomState, ISetMeetingConfig } from "@/interface/room";
import {
  getDisplayMediaStream,
  micToggle,
  screenShareToogle,
  videoToggle,
} from "@/lib/rtc-handler";
import { create } from "zustand";

type Action = {
  setMeetingConfig: (config: ISetMeetingConfig) => void;
  setIsInitiateRoom: (value: boolean) => void;
  setVideo: (status?: boolean) => void;
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
  displayStream: null,
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

  setVideo: (status?: boolean) => {
    set((state) => {
      const videoStatus = status !== undefined ? status : !state.isVideoActive;
      videoToggle(videoStatus);
      return {
        isVideoActive: videoStatus,
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

  setShareScreen: async () => {
    if (!useRoomStore.getState().isShareScreenActive) {
      const displayMediaStream = await getDisplayMediaStream();
      if (displayMediaStream.success) {
        const displayStream = displayMediaStream.stream as MediaStream;

        displayStream.getVideoTracks()[0].onended = () => {
          useRoomStore.getState().setShareScreen();
        };

        useRoomStore.setState(() => ({
          displayStream,
          isShareScreenActive: true,
        }));

        screenShareToogle(
          useRoomStore.getState().isShareScreenActive,
          useRoomStore.getState().displayStream
        );
      }
    } else {
      useRoomStore
        .getState()
        .displayStream?.getTracks()
        .forEach((t) => t?.stop());
      set((state) => {
        return {
          isShareScreenActive: !state.isShareScreenActive,
          displayStream: null,
        };
      });

      screenShareToogle(useRoomStore.getState().isShareScreenActive);
    }
  },
}));

export type IRoomStore = IRoomState & Action;

export const setMessages = (messages: IChatMessage) =>
  useRoomStore.setState({
    messages: [...useRoomStore.getState().messages, messages],
  });

export default useRoomStore;

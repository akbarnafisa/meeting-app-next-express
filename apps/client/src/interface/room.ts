export interface IRoomState {
  isHostMeeting: boolean;
  meetingName: string;
  roomId: string;
  isInitiateRoom: boolean;
  isVideoActive: boolean;
  isConnectOnlyAudio: boolean;
  isMicrophoneActive: boolean;
  isShowParticipants: boolean,
  isShareScreenActive: boolean,
  isShowChatRoom: boolean,
  socketId: string;
  meetingUsers: IUser[];
  messages: IChatMessage[]
}

export interface IUser {
  userId?: string;
  name: string;
  roomId: string;
  createdAt?: string;
  updatedAt?: string;
  socketId: string;
}

export interface ISetMeetingConfig {
  meetingId?: string;
  meetingName: string;
  isHostMeeting: boolean;
  isConnectOnlyAudio: boolean;
}

export interface IMeetingConfig {
  isConnectOnlyAudio: boolean;
  meetingId: string;
  meetingName: string;
  isHostMeeting?: boolean;
}

export interface IChatMessage {
  socketId: string
  name: string
  content: string
}

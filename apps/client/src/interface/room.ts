export interface IRoomState {
  isHostMeeting: boolean;
  meetingName: string;
  roomId: string;
  isInitiateRoom: boolean;
  isVideoActive: boolean;
  isConnectOnlyAudio: boolean;
  isMicrophoneActive: boolean;
  socketId: string;
  meetingUsers: IUser[];
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

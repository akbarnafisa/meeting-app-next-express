export interface IRoomState {
  isHostMeeting: boolean;
  meetingName: string;
  roomId: string;
  isConnectOnlyAudio: boolean;
}


export interface ISetMeetingConfig {
  meetingId?: string
  meetingName: string
  isHostMeeting: boolean
  isConnectOnlyAudio: boolean
}
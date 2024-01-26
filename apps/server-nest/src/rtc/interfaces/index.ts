export interface ICreateRoom {
  meetingName: string;
  isHostMeeting: boolean;
}

export interface IJoinRoom {
  meetingId: string;
  meetingName: string;
}

export interface IUser {
  userId?: string;
  name: string;
  roomId: string;
  createdAt?: string;
  updatedAt?: string;
  socketId: string;
  isHostRoom?: boolean;
}

export interface IGenerateResponse {
  success: boolean;
  message?: string;
}

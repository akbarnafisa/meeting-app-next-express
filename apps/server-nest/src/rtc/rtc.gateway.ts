import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ICreateRoom, IJoinRoom } from './interfaces';
import { RtcRepository } from './rtc.repository';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RtcGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly rtcRepository: RtcRepository) {}

  @SubscribeMessage('create-new-room')
  async handleCreateNewRoom(
    socket: Socket,
    payload: ICreateRoom,
  ): Promise<void> {
    const socketRoom = await this.rtcRepository.createSocketRoom();
    await this.rtcRepository.insertSocketUser({
      name: payload.meetingName,
      roomId: socketRoom.roomId,
      socketId: socket.id,
      isHostRoom: payload.isHostMeeting,
    });

    socket.join(socketRoom.roomId);

    socket.emit('room-id', {
      success: true,
      socketId: socket.id,
      roomId: socketRoom.roomId,
    });

    const connectedUsers = await this.rtcRepository.queryUsersByRoomId(
      socketRoom.roomId,
    );

    socket.emit('room-users', {
      connectedUsers,
    });
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(socket: Socket, payload: IJoinRoom): Promise<void> {
    await this.rtcRepository.insertSocketUser({
      name: payload.meetingName,
      roomId: payload.meetingId,
      socketId: socket.id,
    });

    socket.join(payload.meetingId);

    socket.emit('room-id', {
      success: true,
      socketId: socket.id,
      roomId: payload.meetingId,
    });

    const connectedUsers = await this.rtcRepository.queryUsersByRoomId(
      payload.meetingId,
    );

    socket
      .to(payload.meetingId)
      .emit('connection-prepare', { connectedUserSocketId: socket.id });

    this.server.in(payload.meetingId).emit('room-users', {
      connectedUsers,
    });
  }

  @SubscribeMessage('connection-signal')
  async handleConnectionSignal(socket: Socket, payload: any): Promise<void> {
    const signalingData = {
      signal: payload.signal,
      connectedUserSocketId: socket.id,
    };

    this.server
      .to(payload.connectedUserSocketId)
      .emit('connection-signal', signalingData);
  }

  @SubscribeMessage('connection-init')
  async handleConnectionInit(socket: Socket, payload: any): Promise<void> {
    const initData = {
      connectedUserSocketId: socket.id,
    };

    this.server
      .to(payload.connectedUserSocketId)
      .emit('connection-init', initData);
  }

  async handleConnection(socket: Socket): Promise<void> {
    console.log('handleConnection');
    socket.emit('on gateway connection');
  }

  async afterInit(socket: Socket): Promise<void> {
    console.log('afterInit');
    socket.emit('on gateway init');
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const getUser = await this.rtcRepository.queryUserBySocketId(socket.id);

    console.log('disconnected socket', getUser);

    if (getUser) {
      await this.rtcRepository.removeUserByUserId(getUser.userId);

      socket.leave(getUser.roomId);

      const connectedUsers = await this.rtcRepository.queryUsersByRoomId(
        getUser.roomId,
      );

      this.server.to(getUser.roomId).emit('user-disconnected', {
        socketId: socket.id,
      });

      this.server.to(getUser.roomId).emit('room-users', {
        connectedUsers,
      });
    }
  }
}

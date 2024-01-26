import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ICreateRoom } from './interfaces';
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

  async handleConnectionInit(socket: Socket): Promise<void> {
    console.log('handleConnectionInit');
    socket.emit('on gateway connection');
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
    console.log('handleDisconnect');
    socket.emit('on gateway init');
  }
}

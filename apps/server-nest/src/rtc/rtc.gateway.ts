import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RtcService } from './rtc.service';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: RtcService) {}

  async handleConnectionInit(client: any): Promise<void> {
    console.log('handleConnectionInit');
    client.emit('on gateway connection');
  }

  async handleConnection(client: any): Promise<void> {
    console.log('handleConnection');
    client.emit('on gateway connection');
  }

  async afterInit(client: any): Promise<void> {
    console.log('afterInit');
    client.emit('on gateway init');
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log('handleDisconnect');
    client.emit('on gateway init');
  }
}

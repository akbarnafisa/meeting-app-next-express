import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUser } from './interfaces';

@Injectable()
export class RtcRepository {
  constructor(private prisma: PrismaService) {}

  async getRoom(roomId: string) {
    const data = this.prisma.socket_room.findFirst({
      where: {
        roomId,
      },
      select: {
        roomId: true,
        isActive: true,
      },
    });

    return data;
  }

  createSocketRoom() {
    return this.prisma['socket_room'].create({
      data: {
        isActive: true,
      },
      select: {
        roomId: true,
        createdAt: true,
        isActive: true,
      },
    });
  }

  queryUserBySocketId(socketId: string) {
    return this.prisma['socket_user'].findFirst({
      where: {
        socketId,
      },
      select: {
        userId: true,
        roomId: true,
        socketId: true,
        name: true,
      },
    });
  }

  removeUserByUserId(socketId: string) {
    return this.prisma['socket_user'].delete({
      where: {
        userId: socketId,
      },
      select: {
        roomId: true,
        socketId: true,
        name: true,
      },
    });
  }

  insertSocketUser(createUser: IUser) {
    return this.prisma['socket_user'].create({
      data: {
        name: createUser.name,
        roomId: createUser.roomId,
        socketId: createUser.socketId,
        isHostRoom: createUser.isHostRoom,
      },
      select: {
        roomId: true,
        createdAt: true,
      },
    });
  }

  queryUsersByRoomId(roomId: string) {
    return this.prisma['socket_user'].findMany({
      where: {
        roomId: roomId,
      },
      select: {
        userId: true,
        name: true,
        socketId: true,
      },
    });
  }
}

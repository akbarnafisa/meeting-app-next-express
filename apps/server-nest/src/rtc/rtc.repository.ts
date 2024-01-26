import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}

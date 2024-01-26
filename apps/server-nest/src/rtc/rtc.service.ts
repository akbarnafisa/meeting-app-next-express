import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RtcRepository } from './rtc.repository';

@Injectable()
export class RtcService {
  constructor(private rtcRepository: RtcRepository) {}

  async getMeetingRoom(roomId: string) {
    if (!roomId) {
      throw new HttpException(
        'Room ID is not provided',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const roomData = await this.rtcRepository.getRoom(roomId);

    if (!roomData) {
      throw new HttpException('Room not found!', HttpStatus.NOT_FOUND);
    }

    return roomData;
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { RtcService } from './rtc.service';

@Controller()
export class RtcController {
  constructor(private readonly rtcService: RtcService) {}

  @Get('health')
  async checkHealth() {
    return {
      success: true,
    };
  }

  @Get('/rtc/room/:id')
  async getRoom(@Param('id') id: string) {
    return this.rtcService.getMeetingRoom(id);
  }
}

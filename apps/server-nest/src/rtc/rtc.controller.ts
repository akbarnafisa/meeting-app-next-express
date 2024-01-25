import { Controller, Get } from '@nestjs/common';

@Controller()
export class RtcController {
  @Get('health')
  async checkHealth() {
    return {
      success: true
    }
  }
}

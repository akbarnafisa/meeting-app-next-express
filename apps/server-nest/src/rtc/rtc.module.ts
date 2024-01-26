import { Module } from '@nestjs/common';
import { RtcController } from './rtc.controller';
import { RtcService } from './rtc.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RtcRepository } from './rtc.repository';
import { RtcGateway } from './rtc.gateway';

@Module({
  controllers: [RtcController],
  providers: [RtcService, RtcRepository, RtcGateway],
  imports: [PrismaModule],
})
export class RtcModule {}

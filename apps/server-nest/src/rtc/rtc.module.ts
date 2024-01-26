import { Module } from '@nestjs/common';
import { RtcController } from './rtc.controller';
import { RtcService } from './rtc.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RtcRepository } from './rtc.repository';

@Module({
  controllers: [RtcController],
  providers: [RtcService, RtcRepository],
  imports: [PrismaModule],
})
export class RtcModule {}

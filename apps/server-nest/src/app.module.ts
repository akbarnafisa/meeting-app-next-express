import { Module } from '@nestjs/common';
import { RtcModule } from './rtc/rtc.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [RtcModule, PrismaModule],
})
export class AppModule {}

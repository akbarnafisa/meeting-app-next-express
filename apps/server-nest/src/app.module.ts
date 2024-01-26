import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { RtcModule } from './rtc/rtc.module';

@Module({
  imports: [PrismaModule, RtcModule],
})
export class AppModule {}

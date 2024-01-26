import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/common.filter';
import { TransformInterceptor } from './common/common.interception';
import { PrismaClientExceptionFilter } from './prisma/prisma.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3131);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
}
bootstrap();

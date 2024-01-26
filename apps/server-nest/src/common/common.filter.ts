import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ResponseErrorInterface } from './common.interface';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = exception.getResponse() as string | ResponseErrorInterface;

    let responseMessage = message;

    if (typeof message === 'string') {
      responseMessage = {
        success: false,
        data: null,
        errors: {
          errorMsg: message,
        },
      };
    }

    response.status(status).json(responseMessage);
  }
}

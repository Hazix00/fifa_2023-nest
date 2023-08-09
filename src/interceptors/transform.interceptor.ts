import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { ResponseMessage } from 'src/common/enums/response-message.enum';
  

  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponseDto<T>>
  {
    private message: string;
  
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<ApiResponseDto<T>> {
      const { statusCode } = context.switchToHttp().getResponse();
      const { method } = context.switchToHttp().getRequest();
  
      switch (method) {
        case 'GET':
          this.message = ResponseMessage.FOUND;
          break;
        case 'POST':
          this.message = ResponseMessage.CREATED;
          break;
        case 'PUT':
        case 'PATCH':
          this.message = ResponseMessage.UPDATED;
          break;
        case 'DELETE':
          this.message = ResponseMessage.DELETED;
          break;
        default:
          this.message = 'Success';
      }
  
      return next.handle().pipe(
        map((data) => ({
          statusCode,
          message: this.message,
          data,
        })),
      );
    }
  }
  
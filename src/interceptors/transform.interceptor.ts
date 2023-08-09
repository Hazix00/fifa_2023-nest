import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
import { ApiResponseDto, PaginationResponseDto } from '../common/dtos';
import { ResponseMessage } from '../common/enums';
  

  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponseDto<T>>
  {
    private message: string;
  
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<ApiResponseDto<T> | PaginationResponseDto<T>> {
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
        map((data) => {
          let res: ApiResponseDto<T> | PaginationResponseDto<T> = {
            statusCode,
            message: this.message,
            data
          }
          if(data.data) {
            res = {
              ...res,
              ...data
            }
          }
          else {
            res = {
              ...res,
              data
            }
          }
          return res;
        }),
      );
    }
  }
  
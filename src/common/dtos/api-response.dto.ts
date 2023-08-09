import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class ApiResponseDto<TModel> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  data: TModel;
}

export const ApiResponse = <TModel extends Type<any>>(
  model: TModel,
  isArray = false,
) => {
  let modelSchema: any = {
    properties: {
      data: { $ref: getSchemaPath(model) },
    },
  };

  if (isArray) {
    modelSchema = {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(model) },
        },
      },
    };
  }
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `ResponseOf${model.name}`,
        allOf: [{ $ref: getSchemaPath(ApiResponseDto) }, modelSchema],
      },
    }),
  );
};

export class PaginatedDto<TModel> extends ApiResponseDto<TModel> {
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  next?: number;
  @ApiProperty()
  prev?: number;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const apiResponseExtraModels = [
  ApiResponseDto,
  PaginatedDto
];

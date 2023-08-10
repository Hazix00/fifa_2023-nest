import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class PlayersQueryDto {
    @ApiProperty({ required: false, default: 1 })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Optional()
    page: number = 1;

    @ApiProperty({ required: false, default: 6 })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Optional()
    limit: number = 6;
}
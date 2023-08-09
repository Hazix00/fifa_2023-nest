import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class PlayersQueryDto {
    @ApiProperty({ required: false })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Optional()
    page = 1;

    @ApiProperty({ required: false })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Optional()
    limit = 6;
}
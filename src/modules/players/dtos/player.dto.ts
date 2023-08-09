import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Player } from '@prisma/client';

export class PlayerDto implements Player {
    @ApiProperty()
    id: number;
    @ApiProperty()
    firstname: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    goal: number;
    @ApiProperty()
    salary: number;
    @ApiProperty()
    devise: string;
    @ApiProperty()
    pictureURl: string;
}
export class PlayerWithFormattedSalary extends OmitType(PlayerDto, ['salary']) {
    @ApiProperty()
    id: number;
    @ApiProperty()
    firstname: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    goal: number;
    @ApiProperty()
    devise: string;
    @ApiProperty()
    pictureURl: string;
    @ApiProperty()
    salary: string;
}
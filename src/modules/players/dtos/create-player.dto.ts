import { OmitType } from "@nestjs/swagger";
import { PlayerDto } from "./player.dto";

export class CreatePlayerDto extends OmitType(PlayerDto, ['id', 'pictureURl']) {
    
}
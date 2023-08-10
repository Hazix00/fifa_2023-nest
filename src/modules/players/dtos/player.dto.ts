import { Optional } from '@nestjs/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Player } from '@prisma/client';
import {
  IsDefined,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class DeviseEmptyIfSalaryIsEmpty
  implements ValidatorConstraintInterface
{
  validate(salary: number, args: ValidationArguments) {
    return (
      (!!salary === false && !!args.object['devise'] === false) ||
      !!salary
    );
  }

  defaultMessage(): string {
    return 'salary is required if devise is provided';
  }
}
@ValidatorConstraint({ async: true })
export class SalaryEmptyIfDeviseIsEmpty
  implements ValidatorConstraintInterface
{
  validate(devise: string, args: ValidationArguments) {
    return (
      (!!devise === false && !!args.object['salary'] === false) ||
      !!devise
    );
  }

  defaultMessage(): string {
    return 'devise is required if salary is provided';
  }
}

export class PlayerDto implements Player {
  @ApiProperty()
  id: number;
  @ApiProperty()
  @IsDefined()
  firstname: string;
  @ApiProperty()
  @IsDefined()
  lastname: string;
  @ApiProperty()
  @IsOptional()
  goal: number;
  @ApiProperty()
  @Validate(DeviseEmptyIfSalaryIsEmpty)
  salary: number;
  @ApiProperty()
  @Validate(SalaryEmptyIfDeviseIsEmpty)
  devise: string;
  @ApiProperty()
  @Optional()
  pictureURl: string;
}

export class PlayerWithFormattedSalary extends OmitType(PlayerDto, ['salary']) {
  @ApiProperty()
  salary: string;
}

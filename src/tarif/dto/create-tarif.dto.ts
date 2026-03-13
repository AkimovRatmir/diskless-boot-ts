import { IsString, IsInt } from 'class-validator';

export class CreateTarifDto {
  @IsString()
  name!: string;

  @IsInt()
  time!: number;

  @IsInt()
  price!: number;
}
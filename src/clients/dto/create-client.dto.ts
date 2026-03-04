import { IsString, IsInt } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name!: string;

  @IsString()
  password!: string;

  @IsInt()
  leaseTime!: number;
}

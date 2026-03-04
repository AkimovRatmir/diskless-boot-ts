import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsInt()
  leaseTime?: number;
}

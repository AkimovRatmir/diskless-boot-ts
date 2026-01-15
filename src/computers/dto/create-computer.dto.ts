import { IsString, IsOptional, IsIP } from 'class-validator';

export class CreateComputerDto {
  @IsString()
  name: string;

  @IsString()
  mac: string;

  @IsOptional()
  @IsIP()
  ip?: string;

  @IsOptional()
  groupId?: number;

  @IsOptional()
  bootImgId?: number;

  @IsOptional()
  wbDiskId?: number;
}

import { IsString, IsOptional, IsIP } from 'class-validator';

export class UpdateComputerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  mac?: string;

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

import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateStorageResourceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['WRITEBACK', 'BOOT_IMAGE'])
  resourceType?: 'WRITEBACK' | 'BOOT_IMAGE';

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  iqnSuffix?: string;
}

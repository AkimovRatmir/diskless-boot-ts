import { IsString, IsIn, IsOptional } from 'class-validator';

export class CreateStorageResourceDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(['WRITEBACK', 'BOOT_IMAGE'])
  resourceType: 'WRITEBACK' | 'BOOT_IMAGE';

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  iqnSuffix?: string;
}

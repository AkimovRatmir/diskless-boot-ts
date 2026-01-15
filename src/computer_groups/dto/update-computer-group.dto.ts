import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateComputerGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  defBootImgId?: number;

  @IsOptional()
  @IsInt()
  defWbDiskId?: number;
}

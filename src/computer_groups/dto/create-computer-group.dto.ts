import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateComputerGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  defBootImgId?: number;

  @IsOptional()
  @IsInt()
  defWbDiskId?: number;
}

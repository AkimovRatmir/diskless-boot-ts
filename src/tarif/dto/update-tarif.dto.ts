import { IsString, IsInt, IsOptional } from "class-validator";

export class UpdateTarifDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  time?: number;

  @IsInt()
  @IsOptional()
  price?: number;
}
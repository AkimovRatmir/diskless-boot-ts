import { IsNotEmpty, IsString } from "class-validator";

export class CreatePcDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mac: string;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsString()
  @IsNotEmpty()
  baseVhdx: string;
}

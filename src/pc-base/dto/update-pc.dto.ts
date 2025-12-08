import { PartialType } from "@nestjs/mapped-types";
import { CreatePcDto } from "./create-pc.dto";

export class UpdatePcDto extends PartialType(CreatePcDto) {}

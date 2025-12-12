import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { PcBaseService } from "./pc-base.service";
import { CreatePcDto } from "./dto/create-pc.dto";
import { UpdatePcDto } from "./dto/update-pc.dto";

@Controller("pc-base")
export class PcBaseController {
  constructor(private readonly pcBaseService: PcBaseService) { }

  @Post("create")
  create(@Body() dto: CreatePcDto) {
    return this.pcBaseService.create(dto);
  }

  @Post("turnOn/:id")
  turnOn(@Param("id") id: string) {
    return this.pcBaseService.turnOn(+id);
  }

  @Get("findAll")
  findAll() {
    return this.pcBaseService.findAll();
  }

  @Get("findOne/:id")
  findOne(@Param("id") id: string) {
    return this.pcBaseService.findOne(+id);
  }

  @Patch("update/:id")
  update(@Param("id") id: string, @Body() dto: UpdatePcDto) {
    return this.pcBaseService.update(+id, dto);
  }

  @Delete("deleteById/:id")
  remove(@Param("id") id: string) {
    return this.pcBaseService.remove(+id);
  }
}

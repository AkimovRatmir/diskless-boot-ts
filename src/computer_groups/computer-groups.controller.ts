import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ComputerGroupsService } from './computer-groups.service';
import { CreateComputerGroupDto } from './dto/create-computer-group.dto';
import { UpdateComputerGroupDto } from './dto/update-computer-group.dto';

@Controller('computer-groups')
export class ComputerGroupsController {
  constructor(private readonly service: ComputerGroupsService) {}

  @Post()
  create(@Body() dto: CreateComputerGroupDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateComputerGroupDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

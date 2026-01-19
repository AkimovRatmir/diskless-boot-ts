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
import { StorageResourcesService } from './storage-resources.service';
import { CreateStorageResourceDto } from './dto/create-storage-resource.dto';
import { UpdateStorageResourceDto } from './dto/update-storage-resource.dto';

@Controller('storage-resources')
export class StorageResourcesController {
  constructor(private readonly service: StorageResourcesService) {}

  @Post()
  create(@Body() dto: CreateStorageResourceDto) {
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
    @Body() dto: UpdateStorageResourceDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { TarifService } from "./tarif.controller";
import { CreateTarifDto } from "./dto/create-tarif.dto";
import { UpdateTarifDto } from "./dto/update-tarif.dto";

@Controller('tarifs')
export class TarifController {
    constructor(private readonly service: TarifService) {}

    @Post("create")
    create(@Body() dto: CreateTarifDto) {
        return this.service.createTarif(dto);
    }

    @Get("all")
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number ) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTarifDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete('delete/:id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
import { Controller, Post, Body } from '@nestjs/common';
import { PcService } from './pc.service';

@Controller('pc')
export class PcController {
  constructor(private readonly pcService: PcService) {}

  @Post('turn-on')
  async turnOn(@Body('mac') mac: string) {
    return this.pcService.turnOn(mac);
  }
}

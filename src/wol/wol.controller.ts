import { Controller, Post, Body } from '@nestjs/common';
import { PcService } from './wol.service';

@Controller('wol')
export class PcController {
  constructor(private readonly pcService: PcService) {}

  @Post('turn-on')
  async turnOn(@Body('mac') mac: string) {
    return this.pcService.turnOn(mac);
  }

  @Post('turn-off')
  async turnOff(@Body('ip') ip: string) {
    return this.pcService.turnOff(ip);
  }
}

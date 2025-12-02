import { Module } from '@nestjs/common';
import { PcService } from './pc.service';
import { PcController } from './pc.controller';

@Module({
  providers: [PcService],
  controllers: [PcController]
})
export class PcModule {}

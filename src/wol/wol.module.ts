import { Module } from '@nestjs/common';
import { PcService } from './wol.service';
import { PcController } from './wol.controller';

@Module({
  providers: [PcService],
  controllers: [PcController]
})
export class PcModule {}

import { Module } from '@nestjs/common';
import { TarifController } from './tarif.controller';
import { TarifService } from './tarif.service';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TarifController],
  providers: [TarifService],
  exports: [TarifService],
})
export class TarifModule {}

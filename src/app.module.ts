import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PcModule } from './pc/pc.module';

@Module({
  imports: [PcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

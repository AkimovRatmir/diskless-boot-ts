import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PcModule } from './wol/wol.module';
import { PcBaseModule } from './pc-base/pc-base.module';
import { DatabaseModule } from './db/database.module';  

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PcModule,
    PcBaseModule,
  ],
  controllers: [AppController], // REMOVE PcBaseController (belongs to PcBaseModule)
  providers: [AppService],
})
export class AppModule {}

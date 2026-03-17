import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PcModule } from './wol/wol.module';

import { ComputersModule } from './computers/computer.module';
import { StorageResourcesModule } from './storage_resources/storage-resources.module';
import { ComputerGroupsModule } from './computer_groups/computer-groups.module';

import { DatabaseModule } from './db/database.module';
import { PxeHttpModule } from './pxeHttp/pxe-http.module';
import { ClientsModule } from './clients/clients.module';
import { TarifModule } from './tarif/tarif.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    PcModule,
    ComputersModule,
    StorageResourcesModule,
    ComputerGroupsModule,
    ClientsModule,
    TarifModule,
    PxeHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

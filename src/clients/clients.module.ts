import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}

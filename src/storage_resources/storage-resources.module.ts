import { Module } from '@nestjs/common';
import { StorageResourcesService } from './storage-resources.service';
import { StorageResourcesController } from './storage-resources.controller';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StorageResourcesController],
  providers: [StorageResourcesService],
})
export class StorageResourcesModule {}

import { Module } from '@nestjs/common';
import { ComputerGroupsService } from './computer-groups.service';
import { ComputerGroupsController } from './computer-groups.controller';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ComputerGroupsController],
  providers: [ComputerGroupsService],
})
export class ComputerGroupsModule {}

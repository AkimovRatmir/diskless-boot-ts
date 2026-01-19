import { Module } from '@nestjs/common';
import { PxeHttpController } from './pxe-http.controller';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PxeHttpController],
})
export class PxeHttpModule {}

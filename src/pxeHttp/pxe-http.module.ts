import { Module } from '@nestjs/common';
import { PxeHttpController } from './pxe-http.controller';

@Module({
  controllers: [PxeHttpController],
})
export class PxeHttpModule {}

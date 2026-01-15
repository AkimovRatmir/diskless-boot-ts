import { Module } from '@nestjs/common';
import { ComputersService } from './computers.service';
import { ComputersController } from './computers.controller';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [ComputersController],
  providers: [ComputersService],
})
export class ComputersModule {}

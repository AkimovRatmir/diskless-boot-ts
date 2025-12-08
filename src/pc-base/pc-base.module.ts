import { Module } from "@nestjs/common";
import { PcBaseService } from "./pc-base.service";
import { PcBaseController } from "./pc-base.controller"; 
import { DatabaseModule } from "src/db/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [PcBaseController],
  providers: [PcBaseService],
  exports: [PcBaseService],
})
export class PcBaseModule {}

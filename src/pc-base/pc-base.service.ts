import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { clientPcs } from "../../database/schema";
import { CreatePcDto } from "./dto/create-pc.dto"; 
import { UpdatePcDto } from "./dto/update-pc.dto"; 
import { spawn } from "child_process";

@Injectable()
export class PcBaseService {
  constructor(@Inject("DRIZZLE") private db: any) {}

  // async create(dto: CreatePcDto) {
  //   const [pc] = await this.db.insert(clientPcs).values(dto).returning();
  //   return pc;
  // }

   async create(dto: CreatePcDto) {
  const [pc] = await this.db.insert(clientPcs).values(dto).returning();

  const scriptPath = "C:\\Scripts\\StartSession.ps1"; // update path!

  const ps = spawn("powershell.exe", [
    "-ExecutionPolicy", "Bypass",
    "-File", scriptPath,
    "-ComputerName", pc.name,
    "-MACAddress", pc.mac,
    "-BaseVHDXPath", "C:\\VHDs\\GamePC.vhdx",
  ]);

  let stdout = "";
  let stderr = "";

  ps.stdout.on("data", data => stdout += data.toString());
  ps.stderr.on("data", data => stderr += data.toString());

  const exitCode = await new Promise(resolve => ps.on("close", resolve));

  if (exitCode !== 0) {
    await this.db.delete(clientPcs).where(eq(clientPcs.id, pc.id));

    throw new InternalServerErrorException({
      message: "Failed to start iSCSI session",
      error: stderr.trim(),
      output: stdout.trim(),
    });
  }

  return {
    status: "created",
    pc,
    scriptLog: stdout.trim(),
  };
}


  async findAll() {
    return this.db.select().from(clientPcs);
  }

  async findOne(id: number) {
    const [pc] = await this.db
      .select()
      .from(clientPcs)
      .where(eq(clientPcs.id, id));

    return pc;
  }

  async update(id: number, dto: UpdatePcDto) {
    const [pc] = await this.db
      .update(clientPcs)
      .set(dto)
      .where(eq(clientPcs.id, id))
      .returning();

    return pc;
  }

  async remove(id: number) {
    await this.db.delete(clientPcs).where(eq(clientPcs.id, id));
    return { message: "PC deleted successfully" };
  }
}

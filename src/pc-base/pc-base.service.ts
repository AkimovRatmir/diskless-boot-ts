import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { clientPcs } from "../../database/schema";
import { CreatePcDto } from "./dto/create-pc.dto";
import { UpdatePcDto } from "./dto/update-pc.dto";
import { spawn } from "child_process";

@Injectable()
export class PcBaseService {

  // private scriptPath = "C:\\Project\\pccontrol\\scripts\\StartSession.ps1";

  constructor(@Inject("DRIZZLE") private db: any) { }

  async create(dto: CreatePcDto) {
    const [pc] = await this.db.insert(clientPcs).values(dto).returning();
    return pc;
  }

  async turnOn(id: number) {
    const [pc] = await this.db
      .select()
      .from(clientPcs)
      .where(eq(clientPcs.id, id));

    if (!pc) {
      throw new InternalServerErrorException("PC not found");
    }

    const computerName = pc.name;
    const macAddress = pc.mac;

    const scriptPath = "C:\\Project\\pccontrol\\scripts\\StartSession.ps1";
    const baseVhdPath = pc.base_vhdx;

    console.log(`[ACTION] Turning ON PC: ${computerName} (${macAddress})`);

    const redirectOperator = "*>&1";

    const psCommand = `& { . '${scriptPath}'; Start-IscsiClientSession -ComputerName '${computerName}' -MACAddress '${macAddress}' -BaseVHDXPath '${baseVhdPath}' } ${redirectOperator}`;

    const ps = spawn("powershell.exe", [
      "-ExecutionPolicy", "Bypass",
      "-NoProfile",
      "-Command",
      psCommand
    ]);

    let stdout = "";
    let stderr = "";

    ps.stdout.on("data", data => {
      const out = data.toString();
      stdout += out;
      console.log(`[PS Log] ${out.trim()}`);
    });

    ps.stderr.on("data", data => {
      const err = data.toString();
      stderr += err;
      console.error(`[PS ERROR] ${err.trim()}`);
    });

    const exitCode = await new Promise<number>((resolve) => {
      ps.on("close", resolve);
      ps.on("error", err => {
        console.error(`[SPAWN ERROR] ${err.message}`);
        resolve(1);
      });
    });

    if (exitCode !== 0) {
      throw new InternalServerErrorException({
        message: "Failed to start iSCSI session",
        error: stderr.trim() || "No stderr output",
        output: stdout.trim(),
        exitCode
      });
    }

    console.log(`[SUCCESS] PC turned ON: ${computerName}`);

    return {
      status: "session_started",
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

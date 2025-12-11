import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { clientPcs } from "../../database/schema";
import { CreatePcDto } from "./dto/create-pc.dto"; 
import { UpdatePcDto } from "./dto/update-pc.dto"; 
import { spawn } from "child_process";

@Injectable()
export class PcBaseService {

  // private scriptPath = "C:\\Project\\pccontrol\\scripts\\StartSession.ps1";

  constructor(@Inject("DRIZZLE") private db: any) {}

  // async create(dto: CreatePcDto) {
  //   const [pc] = await this.db.insert(clientPcs).values(dto).returning();
  //   return pc;
  // }
async create(dto: CreatePcDto) {
    // 1. Database Creation (Start of Transaction)
    const [pc] = await this.db.insert(clientPcs).values(dto).returning();

    // Use clear variable names from the PC object
    const computerName = pc.name;
    const macAddress = pc.mac;
    
    // Static paths
    const scriptPath = "C:\\Project\\pccontrol\\scripts\\StartSession.ps1"; 
    const baseVhdPath = "C:\\VHDs\\GamePC.vhdx"; 
    
    console.log(`[DB] Created PC: ${computerName} (${macAddress}). Starting script...`); 

    // Define the redirect operator to merge ALL PowerShell streams to stdout
    const redirectOperator = '*>&1'; 

    // --- 2. Construct the Robust PowerShell Command ---
    // We use the '& { ... }' script block for reliable execution.
    // We use single quotes (') for PowerShell string arguments.
    // We append the redirection operator to capture Write-Host/etc.
    const psCommand = `& { . '${scriptPath}'; Start-IscsiClientSession -ComputerName '${computerName}' -MACAddress '${macAddress}' -BaseVHDXPath '${baseVhdPath}' } ${redirectOperator}`;

    // --- 3. Spawn the Process ---
    const ps = spawn("powershell.exe", [
        "-ExecutionPolicy", "Bypass",
        "-NoProfile", // Speeds up execution by skipping loading of user profiles
        "-Command", 
        psCommand, // Pass the fully constructed command string
    ]);

    let stdout = "";
    let stderr = "";

    // --- 4. Capture and Log Output Streams in Real-Time ---
    
    // All success, host, and warning output should now be here due to *>&1
    ps.stdout.on("data", data => {
        const output = data.toString();
        stdout += output;
        // Log the output directly to your backend console as it comes in
        console.log(`[PS Log] ${output.trim()}`); 
    });
    
    // This should only capture fatal process/non-PowerShell errors
    ps.stderr.on("data", data => {
        const errorOutput = data.toString();
        stderr += errorOutput;
        // Log stderr separately for immediate visibility
        console.error(`[PS CRITICAL ERROR] ${errorOutput.trim()}`); 
    });

    // --- 5. Wait for the Process to Finish ---
    const exitCode = await new Promise<number>((resolve) => {
      // Resolve with the exit code (0 for success, >0 for failure)
      ps.on("close", resolve); 
      
      // Handle the case where the spawned process itself fails to start (e.g., powershell.exe not found)
      ps.on('error', (err) => {
          console.error(`[SPAWN ERROR] Failed to start process: ${err.message}`);
          resolve(1); 
      });
    });

    // --- 6. Error Handling and Cleanup (Rollback) ---
    if (exitCode !== 0) {
      // Rollback: Delete the PC entry created in step 1 if the script failed
      await this.db.delete(clientPcs).where(eq(clientPcs.id, pc.id));
      console.error(`[ROLLBACK] Deleting PC ${computerName} due to script failure (Exit Code: ${exitCode}).`);

      throw new InternalServerErrorException({
        message: "Failed to start iSCSI session. Check script log for details.",
        // Provide both error and stdout output for maximum debugging info
        error: stderr.trim() || 'Script failed with exit code, but no stderr captured.',
        output: stdout.trim(),
        exitCode: exitCode,
      });
    }

    // --- 7. Success Return ---
    console.log(`[SUCCESS] iSCSI session setup complete for ${computerName}.`);
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

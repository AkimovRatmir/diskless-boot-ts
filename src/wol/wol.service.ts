import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class PcService {
  async turnOn(mac: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptPath = '/Users/rat/pc-control/scripts/wol2.ps1'; 

      const ps = spawn('powershell.exe', [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        scriptPath,
        '-Mac',
        mac,
      ]);

      let output = '';
      let errorOutput = '';

      ps.stdout.on('data', (data) => {
        output += data.toString();
      });

      ps.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      ps.on('close', (code) => {
        if (code === 0) {
          resolve({
            status: 'ok',
            message: 'Magic packet sent via PowerShell script',
            scriptOutput: output.trim(),
          });
        } else {
          reject(
            new InternalServerErrorException({
              status: 'error',
              message: 'PowerShell script failed',
              error: errorOutput.trim(),
            }),
          );
        }
      });
    });
  }

  async turnOff(ip: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptPath = '/Users/rat/pc-control/scripts/shutdown.ps1';

      const ps = spawn('powershell.exe', [
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        scriptPath,
        '-Computer',
        ip,
      ]);

      let output = '';
      let errorOutput = '';

      ps.stdout.on('data', (data) => {
        output += data.toString();
      });

      ps.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      ps.on('close', (code) => {
        if (code === 0) {
          resolve({
            status: 'ok',
            message: 'Shutdown command sent',
            scriptOutput: output.trim(),
          });
        } else {
          reject(
            new InternalServerErrorException({
              status: 'error',
              message: 'Shutdown script failed',
              error: errorOutput.trim(),
            }),
          );
        }
      });
    });
  }
}

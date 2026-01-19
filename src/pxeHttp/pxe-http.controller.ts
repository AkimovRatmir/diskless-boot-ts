import {
  Controller,
  Get,
  Req,
  Res,
  Inject,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import * as fs from 'fs';
import * as path from 'path';

import { eq } from 'drizzle-orm';
import { computers } from '../db/schemas/computers';

const ROOT = path.resolve(process.cwd(), 'files');

@Controller()
export class PxeHttpController {
  constructor(
    @Inject("DRIZZLE_DB")
    private readonly db: any,
  ) {}

  @Get('/boot')
  async boot(@Req() req: Request, @Res() res: Response) {
    const macRaw = String(req.query.mac || '');

    if (!macRaw) {
      return res.status(400).send('Missing MAC');
    }

    const mac = macRaw.toUpperCase().replace(/:/g, '-');

    const computer = await this.db
      .select()
      .from(computers)
      .where(eq(computers.mac, mac))
      .limit(1)
      .then((r: any[]) => r[0]);

    if (!computer) {
      res.setHeader('Content-Type', 'text/plain');
      return res.send(`
#!ipxe
echo Unknown computer ${mac}
sleep 10
reboot
`);
    }
    console.log("hi there")
    const iqn = `iqn.2025-12.local.pccontrol:${computer.name}`;

    res.setHeader('Content-Type', 'text/plain');
    res.send(`
#!ipxe
dhcp
echo Booting ${computer.name}
set net0/gateway 0.0.0.0
set keep-san 1
set root-path iscsi:192.168.2.1::::${iqn}
sanboot \${root-path}
boot
`);
  }

  @Get('*')
  async serve(@Req() req: Request, @Res() res: Response) {
    let reqPath = req.path;

    if (reqPath === '/' || reqPath === '') {
      reqPath = '/autoexec.ipxe';
    }

     console.log("hi here")
    const filePath = path.join(ROOT, reqPath);

    if (!filePath.startsWith(ROOT)) {
      return res.status(403).end();
    }

    try {
      const data = fs.readFileSync(filePath);
      res.setHeader('Content-Length', data.length);
      res.send(data);
    } catch {
      res.status(404).end();
    }
  }
}

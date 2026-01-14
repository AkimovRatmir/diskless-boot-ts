import {
  Controller,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd(), 'files');

@Controller()
export class PxeHttpController {

  @Get('*')
  async serve(@Req() req: Request, @Res() res: Response) {
    let reqPath = req.path;

    // Same logic as Rust
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/autoexec.ipxe';
    }

    const filePath = path.join(ROOT, reqPath);

    // Prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
      return res.status(403).end();
    }

    try {
      const data = fs.readFileSync(filePath);

      res.status(200);
      res.setHeader('Content-Length', data.length);
      res.send(data);

      console.log(`[PXE HTTP] served ${reqPath}`);
    } catch {
      res.status(404).end();
      console.warn(`[PXE HTTP] 404 ${reqPath}`);
    }
  }
}

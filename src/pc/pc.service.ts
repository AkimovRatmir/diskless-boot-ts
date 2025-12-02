import { Injectable } from '@nestjs/common';
import wol from 'wake_on_lan';

@Injectable()
export class PcService {
  async turnOn(mac: string) {
    return new Promise((resolve, reject) => {
      wol.wake(mac, { address: '255.255.255.255' }, (error) => {
        if (error) reject(error);
        else resolve({ status: 'ok', message: 'Magic packet sent' });
      });
    });
  }
}

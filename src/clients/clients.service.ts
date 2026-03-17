import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { clients } from 'src/db/schemas/clients';
import { tarifs } from 'src/db/schemas/tarifs';
import { eq, gt, sql } from 'drizzle-orm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Interval } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class ClientsService {
  private readonly logger = new Logger('LeaseTimer');

  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: NodePgDatabase,
  ) {}

  async create(dto: CreateClientDto) {
    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const [created] = await this.db
      .insert(clients)
      .values({ ...dto, password: hashed })
      .returning();
    return created;
  }

  async findAll() {
    return this.db.select().from(clients);
  }

  async findOne(id: number) {
    const [client] = await this.db
      .select()
      .from(clients)
      .where(eq(clients.id, id));

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async getLease(id: number) {
    const [client] = await this.db
      .select({ leaseTime: clients.leaseTime })
      .from(clients)
      .where(eq(clients.id, id));

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client.leaseTime;
  }

  async purchaseTarif(clientId: number, tarifId: number) {
    const [client] = await this.db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId));

    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    const [tarif] = await this.db
      .select()
      .from(tarifs)
      .where(eq(tarifs.id, tarifId));

    if (!tarif) {
      throw new NotFoundException(`Tarif with id ${tarifId} not found`);
    }

    const currentLease = client.leaseTime ?? 0;
    const newLease = currentLease + tarif.time;

    const [updated] = await this.db
      .update(clients)
      .set({ leaseTime: newLease })
      .where(eq(clients.id, clientId))
      .returning();

    return {
      client: updated,
      purchasedTarif: tarif.name,
      addedTime: tarif.time,
      totalLeaseTime: newLease,
    };
  }

  @Interval(60_000)
  async tickLeaseTime() {
    // Get all clients with lease_time > 0
    const activeClients = await this.db
      .select()
      .from(clients)
      .where(gt(clients.leaseTime, 0));

    if (activeClients.length === 0) return;

    // Decrement all active leases by 1 minute
    await this.db
      .update(clients)
      .set({ leaseTime: sql`${clients.leaseTime} - 1` })
      .where(gt(clients.leaseTime, 0));

    // Check who just expired (had exactly 1 minute left)
    for (const client of activeClients) {
      if (client.leaseTime === 1) {
        this.logger.warn(
          `Time has ended for client id=${client.id} name="${client.name}"`,
        );
      } else {
        this.logger.log(
          `Client id=${client.id} "${client.name}" - ${(client.leaseTime ?? 1) - 1} min remaining`,
        );
      }
    }
  }

  async update(id: number, dto: UpdateClientDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    const [updated] = await this.db
      .update(clients)
      .set(dto)
      .where(eq(clients.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException('Client not found');
    }

    return updated;
  }

  async remove(id: number) {
    const [deleted] = await this.db
      .delete(clients)
      .where(eq(clients.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException('Client not found');
    }

    return deleted;
  }
}

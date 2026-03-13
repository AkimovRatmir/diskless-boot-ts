import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { clients } from 'src/db/schemas/clients';
import { eq } from 'drizzle-orm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class ClientsService {
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

  async getLease(id: number ){
    const [client] = await this.db
      .select({ leaseTime: clients.leaseTime })
      .from(clients)
      .where(eq(clients.id, id));

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client.leaseTime;
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

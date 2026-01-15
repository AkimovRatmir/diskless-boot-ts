import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { computers } from 'src/db/schemas/computers'; 
import { eq } from 'drizzle-orm';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';

@Injectable()
export class ComputersService {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: NodePgDatabase,
  ) {}

  async create(dto: CreateComputerDto) {
    const [created] = await this.db.insert(computers).values(dto).returning();
    return created;
  }

  async findAll() {
    return this.db.select().from(computers);
  }

  async findOne(id: number) {
    const [computer] = await this.db
      .select()
      .from(computers)
      .where(eq(computers.id, id));

    if (!computer) {
      throw new NotFoundException('Computer not found');
    }

    return computer;
  }

  async update(id: number, dto: UpdateComputerDto) {
    const [updated] = await this.db
      .update(computers)
      .set(dto)
      .where(eq(computers.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException('Computer not found');
    }

    return updated;
  }

  async remove(id: number) {
    const [deleted] = await this.db
      .delete(computers)
      .where(eq(computers.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException('Computer not found');
    }

    return deleted;
  }
}

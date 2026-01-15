import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { computerGroups } from 'src/db/schemas/computer-groups'; 
import { eq } from 'drizzle-orm';
import { CreateComputerGroupDto } from './dto/create-computer-group.dto';
import { UpdateComputerGroupDto } from './dto/update-computer-group.dto';

@Injectable()
export class ComputerGroupsService {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: NodePgDatabase,
  ) {}

  // CREATE
  async create(dto: CreateComputerGroupDto) {
    const [created] = await this.db
      .insert(computerGroups)
      .values(dto)
      .returning();

    return created;
  }

  // READ ALL
  async findAll() {
    return this.db.select().from(computerGroups);
  }

  // READ ONE
  async findOne(id: number) {
    const [group] = await this.db
      .select()
      .from(computerGroups)
      .where(eq(computerGroups.id, id));

    if (!group) {
      throw new NotFoundException('Computer group not found');
    }

    return group;
  }

  // UPDATE
  async update(id: number, dto: UpdateComputerGroupDto) {
    const [updated] = await this.db
      .update(computerGroups)
      .set(dto)
      .where(eq(computerGroups.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException('Computer group not found');
    }

    return updated;
  }

  // DELETE
  async remove(id: number) {
    const [deleted] = await this.db
      .delete(computerGroups)
      .where(eq(computerGroups.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException('Computer group not found');
    }

    return deleted;
  }
}

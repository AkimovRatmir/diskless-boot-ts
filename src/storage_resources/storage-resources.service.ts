import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { storageResources } from 'src/db/schemas/storage-resources'; 
import { eq } from 'drizzle-orm';
import { CreateStorageResourceDto } from './dto /create-storage-resource.dto'; 
import { UpdateStorageResourceDto } from './dto /update-storage-resource.dto';

@Injectable()
export class StorageResourcesService {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: NodePgDatabase,
  ) {}

  // CREATE
  async create(dto: CreateStorageResourceDto) {
    const [created] = await this.db
      .insert(storageResources)
      .values(dto)
      .returning();

    return created;
  }

  // READ ALL
  async findAll() {
    return this.db.select().from(storageResources);
  }

  // READ ONE
  async findOne(id: number) {
    const [resource] = await this.db
      .select()
      .from(storageResources)
      .where(eq(storageResources.id, id));

    if (!resource) {
      throw new NotFoundException('Storage resource not found');
    }

    return resource;
  }

  // UPDATE
  async update(id: number, dto: UpdateStorageResourceDto) {
    const [updated] = await this.db
      .update(storageResources)
      .set(dto)
      .where(eq(storageResources.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException('Storage resource not found');
    }

    return updated;
  }

  // DELETE
  async remove(id: number) {
    const [deleted] = await this.db
      .delete(storageResources)
      .where(eq(storageResources.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException('Storage resource not found');
    }

    return deleted;
  }
}

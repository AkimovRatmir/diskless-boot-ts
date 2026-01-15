import {
  pgTable,
  serial,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { storageResources } from './storage-resources';

export const computerGroups = pgTable('computer_groups', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 50 }).notNull(),

  defBootImgId: integer('def_boot_img_id')
    .references(() => storageResources.id, { onDelete: 'set null' }),

  defWbDiskId: integer('def_wb_disk_id')
    .references(() => storageResources.id, { onDelete: 'set null' }),
});

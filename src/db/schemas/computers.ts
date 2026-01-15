import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { storageResources } from './storage-resources';
import { computerGroups } from './computer-groups';

export const computers = pgTable('computers', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 50 }).notNull(),

  mac: varchar('mac', { length: 17 }).notNull(),

  ip: varchar('ip', { length: 15 }),

  createdAt: timestamp('created_at').defaultNow(),

  bootImgId: integer('boot_img_id')
    .references(() => storageResources.id, { onDelete: 'set null' }),

  wbDiskId: integer('wb_disk_id')
    .references(() => storageResources.id, { onDelete: 'set null' }),

  groupId: integer('group_id')
    .references(() => computerGroups.id, { onDelete: 'set null' }),
});

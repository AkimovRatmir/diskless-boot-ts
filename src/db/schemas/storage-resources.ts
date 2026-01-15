import {
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

export const storageResources = pgTable('storage_resources', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 100 }).notNull(),

  resourceType: varchar('resource_type', { length: 50 }).notNull(),

  path: varchar('path', { length: 255 }).notNull(),

  iqnSuffix: varchar('iqn_suffix', { length: 255 }),
});

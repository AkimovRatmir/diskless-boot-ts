import {
  pgTable,
  serial,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 100 }).notNull(),

  password: varchar('password', { length: 255 }),

  leaseTime: integer('lease_time'),

});

import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const clientPcs = pgTable("client_pcs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  mac: varchar("mac", { length: 17 }).notNull().unique(),
  ip: varchar("ip", { length: 15 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

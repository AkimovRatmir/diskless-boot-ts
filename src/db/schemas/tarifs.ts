import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const tarifs = pgTable("tarifs", {
    id: serial("id").primaryKey(),

    name: varchar("name", { length: 100 }).notNull(),

    time: integer("time").notNull(),

    price: integer("price").notNull(),
})
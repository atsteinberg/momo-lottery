import { relations } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  clerkId: text("clerk_id").notNull().unique(),
  childId: uuid("child_id").references(() => children.id),
});

export const usersRelations = relations(users, ({ one }) => ({
  child: one(children, {
    fields: [users.childId],
    references: [children.id],
  }),
}));

export const children = pgTable("children", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const childrenRelations = relations(children, ({ many }) => ({
  users: many(users),
}));

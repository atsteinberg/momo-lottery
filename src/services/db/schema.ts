import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  clerkId: text('clerk_id').notNull().unique(),
  childId: uuid('child_id').references(() => children.id),
  isVerified: boolean('is_verified').default(false),
});

export const usersRelations = relations(users, ({ one }) => ({
  child: one(children, {
    fields: [users.childId],
    references: [children.id],
  }),
}));

export const children = pgTable('children', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
});

export const childrenRelations = relations(children, ({ many }) => ({
  users: many(users),
}));

export const appSettings = pgTable('app_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  targetMonth: date('target_month').notNull(),
});

export const lunchRequests = pgTable('lunch_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  targetMonth: date('target_month'),
  userId: uuid('user_id').references(() => users.id),
  snackRequestId: uuid('snack_request_id').references(() => snackRequests.id),
});

export const snackRequests = pgTable('snack_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  targetMonth: date('target_month'),
  userId: uuid('user_id').references(() => users.id),
});

export const lunchRequestsRelations = relations(lunchRequests, ({ one }) => ({
  snack: one(snackRequests, {
    fields: [lunchRequests.snackRequestId],
    references: [snackRequests.id],
  }),
}));

export const snackRequestsRelations = relations(snackRequests, ({ one }) => ({
  lunch: one(lunchRequests, {
    fields: [snackRequests.id],
    references: [lunchRequests.snackRequestId],
  }),
}));

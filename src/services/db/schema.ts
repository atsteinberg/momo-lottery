import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export type MealRequestType = 'lunch' | 'snacks';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  clerkId: text('clerk_id').notNull().unique(),
  childId: uuid('child_id').references(() => children.id),
  isVerified: boolean('is_verified').default(false),
  isAdmin: boolean('is_admin').default(false),
});

export const usersRelations = relations(users, ({ one }) => ({
  child: one(children, {
    fields: [users.childId],
    references: [children.id],
  }),
}));

export const children = pgTable('children', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  name: text('name').notNull(),
});

export const childrenRelations = relations(children, ({ many }) => ({
  users: many(users),
}));

export const appSettings = pgTable('app_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  targetMonth: text('target_month').notNull(),
});

export const mealRequests = pgTable('meal_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  date: text('date').notNull(),
  targetMonth: text('target_month').notNull(),
  userId: uuid('user_id').references(() => users.id),
  childId: uuid('child_id')
    .references(() => children.id)
    .notNull(),
  type: text('meal_type', {
    enum: ['lunch', 'snacks'],
  })
    .$type<MealRequestType>()
    .notNull(),
});

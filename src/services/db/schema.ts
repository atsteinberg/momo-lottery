import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
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
  targetMonth: integer('target_month').notNull(),
  targetYear: integer('target_year').notNull(),
  deadline: date('deadline', { mode: 'date' }).notNull(),
});

export const mealRequests = pgTable('meal_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id').references(() => users.id),
  childId: uuid('child_id')
    .references(() => children.id)
    .notNull(),
  mealDayId: uuid('meal_day_id')
    .references(() => mealDays.id)
    .notNull(),
  hasWon: boolean('has_won'),
});

export const mealDays = pgTable(
  'meal_days',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    year: integer('year').notNull(),
    month: integer('month').notNull(),
    day: integer('day').notNull(),
    type: text('meal_type', {
      enum: ['lunch', 'snacks'],
    })
      .$type<MealRequestType>()
      .notNull(),
  },
  (table) => ({
    uniqueDatePerType: unique().on(
      table.year,
      table.month,
      table.day,
      table.type,
    ),
  }),
);

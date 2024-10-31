'use server';

import db from '@/services/db';
import { mealRequests } from '@/services/db/schema';
import { getExistingUser } from '@/utils/user';
import { format } from 'date-fns';
import { and, eq } from 'drizzle-orm';

type DateActionParams = {
  type: 'lunch' | 'snacks';
  targetMonth: string;
  date: Date;
};

const user = await getExistingUser();

export async function addDate({ type, targetMonth, date }: DateActionParams) {
  await db.insert(mealRequests).values({
    type,
    userId: user.id,
    targetMonth,
    date: format(date, "yyyy-MM-dd'T'00:00:00.000'Z'"),
  });
}

export async function removeDate({
  type,
  targetMonth,
  date,
}: DateActionParams) {
  await db
    .delete(mealRequests)
    .where(
      and(
        eq(mealRequests.type, type),
        eq(mealRequests.userId, user.id),
        eq(mealRequests.targetMonth, targetMonth),
        eq(mealRequests.date, date.toISOString()),
      ),
    );
}

'use server';

import db from '@/services/db';
import { mealRequests } from '@/services/db/schema';
import { getDateString } from '@/utils/dates';
import { getExistingUser } from '@/utils/user';
import { and, eq } from 'drizzle-orm';

type DateActionParams = {
  type: 'lunch' | 'snacks';
  targetMonth: Date;
  date: Date;
};

const user = await getExistingUser();

export async function addDate({ type, targetMonth, date }: DateActionParams) {
  if (!user.childId) throw new Error('No child ID found');

  await db.insert(mealRequests).values({
    type: type,
    userId: user.id,
    targetMonth: getDateString(targetMonth),
    date: getDateString(date),
    childId: user.childId,
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
        eq(mealRequests.targetMonth, getDateString(targetMonth)),
        eq(mealRequests.date, getDateString(date)),
      ),
    );
}

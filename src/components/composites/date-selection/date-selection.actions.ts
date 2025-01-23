'use server';

import db from '@/services/db';
import {
  mealDays,
  mealRequestMealDays,
  mealRequests,
} from '@/services/db/schema';
import { getExistingUser } from '@/utils/user';
import { and, eq } from 'drizzle-orm';

type DateActionParams = {
  type: 'lunch' | 'snacks';
  date: Date;
};

export async function addDate({ type, date }: DateActionParams) {
  const user = await getExistingUser();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return await db.transaction(async (tx) => {
    if (!user.childId) throw new Error('No child ID found');
    const [{ mealDayId }] = await tx
      .select({ mealDayId: mealDays.id })
      .from(mealDays)
      .where(
        and(
          eq(mealDays.type, type),
          eq(mealDays.month, month),
          eq(mealDays.day, day),
          eq(mealDays.year, year),
        ),
      );

    const [{ mealRequestId }] = await tx
      .insert(mealRequests)
      .values({
        childId: user.childId,
        userId: user.id,
      })
      .returning({ mealRequestId: mealRequests.id });

    await tx.insert(mealRequestMealDays).values({ mealDayId, mealRequestId });
  });
}

export async function removeDate({ type, date }: DateActionParams) {
  const user = await getExistingUser();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return await db.transaction(async (tx) => {
    if (!user.childId) throw new Error('No child ID found');
    const [{ mealRequestId, mealDayId }] = await tx
      .select({ mealRequestId: mealRequests.id, mealDayId: mealDays.id })
      .from(mealRequests)
      .innerJoin(
        mealRequestMealDays,
        eq(mealRequests.id, mealRequestMealDays.mealRequestId),
      )
      .innerJoin(mealDays, eq(mealRequestMealDays.mealDayId, mealDays.id))
      .where(
        and(
          eq(mealDays.type, type),
          eq(mealDays.month, month),
          eq(mealDays.day, day),
          eq(mealDays.year, year),
          eq(mealRequests.childId, user.childId),
        ),
      );

    await tx
      .delete(mealRequestMealDays)
      .where(
        and(
          eq(mealRequestMealDays.mealDayId, mealDayId),
          eq(mealRequestMealDays.mealRequestId, mealRequestId),
        ),
      );

    await tx.delete(mealRequests).where(eq(mealRequests.id, mealRequestId));
  });
}

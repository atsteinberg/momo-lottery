'use server';

import db from '@/services/db';
import { appSettings, mealDays, mealRequests } from '@/services/db/schema';
import { getYearFromTargetMonthAndYear, parseCETDate } from '@/utils/dates';
import { getExistingUser } from '@/utils/user';
import { and, eq } from 'drizzle-orm';

type DateActionParams = {
  type: 'lunch' | 'snacks';
  date: Date;
};

export const addDate = async ({ type, date }: DateActionParams) => {
  const user = await getExistingUser();
  const { year, month, day } = parseCETDate(date);

  console.log({ year, month, day });

  return await db.transaction(async (tx) => {
    const [{ targetMonth, targetYear }] = await tx
      .select({
        targetMonth: appSettings.targetMonth,
        targetYear: appSettings.targetYear,
      })
      .from(appSettings);

    if (
      targetMonth !== month ||
      getYearFromTargetMonthAndYear(targetMonth, targetYear) !== year
    ) {
      throw new Error('Das ausgewählte Datum ist nicht (mehr) auswählbar.');
    }
    if (!user.childId) throw new Error('Es konnte kein Kind gefunden werden.');
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

    await tx.insert(mealRequests).values({
      childId: user.childId,
      userId: user.id,
      mealDayId: mealDayId,
    });
  });
};

export const removeDate = async ({ type, date }: DateActionParams) => {
  const user = await getExistingUser();
  const { year, month, day } = parseCETDate(date);

  return await db.transaction(async (tx) => {
    if (!user.childId) throw new Error('Es konnte kein Kind gefunden werden.');
    const [{ mealRequestId }] = await tx
      .select({ mealRequestId: mealRequests.id, mealDayId: mealDays.id })
      .from(mealRequests)
      .innerJoin(mealDays, eq(mealRequests.mealDayId, mealDays.id))
      .where(
        and(
          eq(mealDays.type, type),
          eq(mealDays.month, month),
          eq(mealDays.day, day),
          eq(mealDays.year, year),
          eq(mealRequests.childId, user.childId),
        ),
      );

    await tx.delete(mealRequests).where(eq(mealRequests.id, mealRequestId));
  });
};

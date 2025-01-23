import db from '@/services/db';
import {
  appSettings,
  mealDays,
  mealRequestMealDays,
  mealRequests,
} from '@/services/db/schema';
import { PropsWithClassName } from '@/types/react';
import { getNormalizedTargetYear } from '@/utils/dates';
import { cn } from '@/utils/tailwind';
import { getExistingUser } from '@/utils/user';
import { and, eq } from 'drizzle-orm';
import { FC } from 'react';
import DateSelectionClient from './date-selection.client';

type DateSelectionProps = PropsWithClassName<{
  type: 'lunch' | 'snacks';
}>;

export type DateSelectionConfig = (typeof config)[keyof typeof config];

const config = {
  lunch: {
    title: 'Mittagessen',
  },
  snacks: {
    title: 'Jause',
  },
};

const DateSelection: FC<DateSelectionProps> = async ({ type, className }) => {
  const user = await getExistingUser();
  if (!user.childId) throw new Error('No child ID found');
  const [{ targetMonth, targetYear }] = await db
    .select({
      targetMonth: appSettings.targetMonth,
      targetYear: appSettings.targetYear,
    })
    .from(appSettings);
  const normalizedTargetYear = getNormalizedTargetYear(targetYear, targetMonth);
  console.log('normalizedTargetYear', normalizedTargetYear);

  const selectedDays = await db
    .select({
      year: mealDays.year,
      month: mealDays.month,
      day: mealDays.day,
    })
    .from(mealRequests)
    .innerJoin(
      mealRequestMealDays,
      eq(mealRequests.id, mealRequestMealDays.mealRequestId),
    )
    .innerJoin(mealDays, eq(mealRequestMealDays.mealDayId, mealDays.id))
    .where(
      and(
        eq(mealRequests.childId, user.childId),
        eq(mealDays.type, type),
        eq(mealDays.month, targetMonth),
        eq(mealDays.year, normalizedTargetYear),
      ),
    );

  const selectedDates = selectedDays.map(
    ({ year, month, day }) => new Date(year, month - 1, day),
  );

  const availableDays = await db
    .select({ year: mealDays.year, month: mealDays.month, day: mealDays.day })
    .from(mealDays)
    .where(
      and(
        eq(mealDays.year, normalizedTargetYear),
        eq(mealDays.month, targetMonth),
        eq(mealDays.type, type),
      ),
    );

  const availableDates = availableDays.map(
    ({ year, month, day }) => new Date(year, month - 1, day),
  );

  console.log('availableDates', availableDates);

  return (
    <div className={cn('bg-card rounded-lg p-4', className)}>
      <DateSelectionClient
        type={type}
        config={config[type]}
        availableDates={availableDates}
        selectedDates={selectedDates}
        month={new Date(normalizedTargetYear, targetMonth - 1)}
      />
    </div>
  );
};

export default DateSelection;

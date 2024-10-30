import db from '@/services/db';
import { appSettings, mealRequests } from '@/services/db/schema';
import { PropsWithClassName } from '@/types/react';
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
  const [{ targetMonth }] = await db
    .select({ targetMonth: appSettings.targetMonth })
    .from(appSettings);
  const requests = await db
    .select({ date: mealRequests.date })
    .from(mealRequests)
    .where(
      and(
        eq(mealRequests.type, type),
        eq(mealRequests.userId, user.id),
        eq(mealRequests.targetMonth, targetMonth),
      ),
    );
  return (
    <div className={cn('bg-card rounded-lg p-4', className)}>
      <DateSelectionClient
        config={config[type]}
        availableDates={[
          new Date('11-01-2024'),
          new Date('11-02-2024'),
          new Date('11-03-2024'),
        ]}
        selectedDates={requests.map((request) => new Date(request.date))}
        month={new Date(targetMonth)}
      />
    </div>
  );
};

export default DateSelection;

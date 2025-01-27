import DateSelection from '@/components/composites/date-selection/date-selection';
import RulesInfo from '@/components/composites/rules-info';
import Typography from '@/components/ui/typography/typography';
import db from '@/services/db';
import { appSettings } from '@/services/db/schema';
import { getMonth } from '@/utils/dates';
import { getExistingUser } from '@/utils/user';
import { sql } from 'drizzle-orm';
import { FC } from 'react';

const HomePage: FC = async () => {
  const [{ date, deadline }] = await db
    .select({
      date: sql<string>`CONCAT(${appSettings.targetYear}, '-', LPAD(${appSettings.targetMonth}::text, 2, '0'))`,
      deadline: appSettings.deadline,
    })
    .from(appSettings);

  const month = getMonth(date);
  const user = await getExistingUser();
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex flex-row items-baseline">
        <div className="flex-row">
          <Typography as="h3">
            An welchem Tag soll {user.child?.name} im {month} fürs Essen sorgen?
          </Typography>
          <Typography as="h5">
            (Bitte bis Ende {deadline.toLocaleDateString()} eintragen)
          </Typography>
        </div>
        <RulesInfo className="ml-2" />
      </div>
      <div className="flex flex-col w-full sm:flex-row gap-4">
        <DateSelection type="lunch" className="sm:w-1/2 w-full" />
        <DateSelection type="snacks" className="sm:w-1/2 w-full" />
      </div>
    </div>
  );
};

export default HomePage;

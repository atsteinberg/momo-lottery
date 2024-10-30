import DateSelection from '@/components/composites/date-selection/date-selection';
import RulesInfo from '@/components/composites/rules-info';
import Typography from '@/components/ui/typography/typography';
import db from '@/services/db';
import { getMonth } from '@/utils/dates';
import { getExistingUser } from '@/utils/user';
import { FC } from 'react';

const HomePage: FC = async () => {
  const month = getMonth((await db.query.appSettings.findFirst())?.targetMonth);
  const user = await getExistingUser();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center">
        <Typography as="h3">
          An welchem Tag soll {user.child?.name} im {month} fürs Essen sorgen?
        </Typography>
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

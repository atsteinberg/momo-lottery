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
    <div>
      <div className="flex flex-row items-baseline">
        <Typography as="h3">
          An welchem Tag soll {user.child?.name} im {month} fürs Essen sorgen?
        </Typography>
        <RulesInfo className="ml-2" />
      </div>
    </div>
  );
};

export default HomePage;

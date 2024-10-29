import Typography from '@/components/ui/typography/typography';
import db from '@/services/db';
import { getMonth } from '@/utils/dates';
import { getExistingUser } from '@/utils/user';
import { FC } from 'react';

const HomePage: FC = async () => {
  const month = getMonth((await db.query.appSettings.findFirst())?.targetMonth);
  const user = await getExistingUser();
  return (
    <>
      <Typography as="h3">
        An welchem Tag soll {user.child?.name} im {month} fürs Essen sorgen?
      </Typography>
    </>
  );
};

export default HomePage;

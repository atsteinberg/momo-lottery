'use server';

import getUser from '@/utils/user';

export const checkVerification = async () => {
  const user = await getUser();
  if (!user || !user.isVerified) {
    return false;
  }
  return true;
};

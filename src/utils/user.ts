'use server';

import db from '@/services/db';
import { users } from '@/services/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export const getUser = async (clerkUserId?: string | null) => {
  const id = clerkUserId ?? (await currentUser())?.id;
  if (!id) {
    return null;
  }
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, id),
    with: {
      child: true,
    },
  });
  return dbUser ?? null;
};

export const getExistingUser = async (clerkUserId?: string | null) => {
  const user = await getUser(clerkUserId);
  if (!user) {
    throw new Error('Cannot retrieve user');
  }
  return user;
};

export default getUser;

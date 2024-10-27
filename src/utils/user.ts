import db from '@/services/db';
import { users } from '@/services/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export const getUser = async (clerkUserId: string | null) => {
  const id = clerkUserId ?? (await currentUser())?.id;
  if (!id) {
    return null;
  }
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, id),
  });
  return dbUser ?? null;
};

export default getUser;

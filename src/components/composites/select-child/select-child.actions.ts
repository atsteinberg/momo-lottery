'use server';

import db from '@/services/db';

import { children, users } from '@/services/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { sql } from 'drizzle-orm';
import { FormSchema, SelectChildFormValues } from './select-child.schema';

const addNewKid = async (name?: string) => {
  if (!name) {
    throw new Error('New kid name is required');
  }
  const [newKid] = await db
    .insert(children)
    .values({ name })
    .returning({ id: children.id });
  return newKid.id;
};

export const registerUser = async (data: SelectChildFormValues) => {
  const parsedData = FormSchema.parse(data);
  const user = await currentUser();
  const kidId =
    parsedData.kid === 'new'
      ? await addNewKid(parsedData.newKid)
      : parsedData.kid;

  const [result] = await db
    .insert(users)
    .values({
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      email: user?.emailAddresses[0].emailAddress ?? '',
      clerkId: user?.id ?? '',
      childId: kidId,
      isVerified: false,
    })
    .returning({
      childName: sql`(SELECT ${children.name} FROM ${children} WHERE ${children.id} = ${kidId})`,
    });
  return result;
};

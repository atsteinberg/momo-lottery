'use server';

import db from '@/services/db';

import { children, users } from '@/services/db/schema';
import { sendEmail } from '@/services/sendgrid';
import { currentUser } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
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
      childName: sql<string>`(SELECT ${children.name} FROM ${children} WHERE ${children.id} = ${kidId})`,
    });
  return result;
};

export const sendVerificationEmail = async ({
  userEmail,
  childName,
}: {
  userEmail: string;
  childName: string;
}) => {
  const emails = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.isAdmin, true));
  try {
    await Promise.all(
      emails.map(async ({ email }) => {
        try {
          const msg = {
            to: email,
            subject: 'Neue Registrierungsanfrage',
            html: `
              <p>Eine neue Registrierungsanfrage ist eingegangen:</p>
              <p>Kind: ${childName}</p>
              <p>Nutzeremail: ${userEmail}</p>
            `,
          };

          const response = await sendEmail(msg);
          console.log('Email sent successfully', response);
        } catch (error) {
          console.error('Failed to send email', {
            error,
            email,
            childName,
            userEmail,
          });
          throw error;
        }
      }),
    );
  } catch (error) {
    console.error('Failed to send emails', { error });
    throw error;
  }
};

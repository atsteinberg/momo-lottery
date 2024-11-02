import db from '@/services/db';
import { mealRequests, users } from '@/services/db/schema';
import { sendEmail } from '@/services/db/sendgrid';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { draw, preDraw } from './route.utils';

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  // TODO change appsettings for next month and revalidate home page
  const requests = await db
    .select({
      childId: mealRequests.childId,
      user: {
        email: users.email,
        firstName: users.firstName,
      },
      date: mealRequests.date,
    })
    .from(mealRequests)
    .innerJoin(users, eq(users.id, mealRequests.userId));

  const { lottery, childrenEmails } = requests.reduce<{
    lottery: {
      lunch: { [date: string]: string[] };
      snacks: { [date: string]: string[] };
    };
    childrenEmails: { [childId: string]: [string, string][] };
  }>(
    (acc, { childId, date, user }) => {
      return {
        lottery: {
          lunch: {
            ...acc.lottery.lunch,
            [date]: [...acc.lottery.lunch[date], childId],
          },
          snacks: {
            ...acc.lottery.snacks,
            [date]: [...acc.lottery.snacks[date], childId],
          },
        },
        childrenEmails: {
          ...acc.childrenEmails,
          [childId]: [
            ...acc.childrenEmails[childId],
            [user.email, user.firstName ?? 'Anonymer Benutzer'],
          ],
        },
      };
    },
    { lottery: { lunch: {}, snacks: {} }, childrenEmails: {} },
  );
  const { results: lunchResults } = draw({ openDraws: lottery.lunch });
  const { results: snackResults } = draw(
    preDraw({ openSnackDraws: lottery.snacks, lunchResults }),
  );
  for (const [childId, [email, firstName]] of Object.entries(childrenEmails)) {
    const assignedLunchDate = lunchResults[childId];
    const assignedSnackDate = snackResults[childId];
    const lunchText = assignedLunchDate
      ? `Gezogener Mittagessenstermin: ${assignedLunchDate}`
      : 'Leider konnte euch kein Mittagessenstermin zugewiesen werden.';
    const snackText = assignedSnackDate
      ? `Gezogener Jausentermin: ${assignedSnackDate}`
      : 'Leider konnte euch kein Jausentermin zugewiesen werden.';
    sendEmail({
      to: email,
      subject: 'Die Essenslotterieergebnisse sind da!',
      text: `Hi ${firstName},\n\nDie Ergebnisse der Essenslotterie sind da:\n\n${lunchText}\n${snackText}`,
    });

    // TODO add results to google docs
  }

  return Response.json({ success: true });
};

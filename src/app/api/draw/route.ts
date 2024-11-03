import db from '@/services/db';
import { appSettings, mealRequests, users } from '@/services/db/schema';
import { sendEmail } from '@/services/db/sendgrid';
import { getMonthDateString } from '@/utils/dates';
import { draw, preDraw } from '@/utils/draws';
import { addMonths } from 'date-fns';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

const updateAppSettingsToNextMonth = async (targetMonth: string) => {
  await db
    .update(appSettings)
    .set({ targetMonth: getMonthDateString(addMonths(targetMonth, 1)) });
  revalidatePath('/');
};

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  const [{ targetMonth }] = await db
    .select({
      targetMonth: appSettings.targetMonth,
    })
    .from(appSettings);
  await updateAppSettingsToNextMonth(targetMonth);

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
    .innerJoin(users, eq(users.id, mealRequests.userId))
    .where(eq(mealRequests.targetMonth, targetMonth));

  // changing appSettings to next month

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
      text: `Hi ${firstName},\n\nDie Ergebnisse der Essenslotterie sind da:\n\n${lunchText}\n${snackText}\n\nBitte trage wie gehabt Dein Menü bei Google Sheets ein, sobald das Sheet verfügbar ist (ab ca. 9 Uhr am 15.).`,
    });

    // TODO add results to google docs
  }

  return Response.json({ success: true });
};

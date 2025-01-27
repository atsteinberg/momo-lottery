import db from '@/services/db';
import {
  appSettings,
  mealDays,
  mealRequestMealDays,
  mealRequests,
  users,
} from '@/services/db/schema';
import { sendEmail } from '@/services/db/sendgrid';
import { getYearFromTargetMonthAndYear } from '@/utils/dates';
import { draw, preDraw } from '@/utils/draws';
import { addMonths } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

const updateAppSettingsToNextMonth = async (
  currentTargetMonth: number,
  deadline: Date,
) => {
  await db.update(appSettings).set({
    targetMonth: (currentTargetMonth % 12) + 1,
    deadline: addMonths(deadline, 1),
  });
  revalidatePath('/');
};

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  const [{ targetMonth, targetYear, deadline }] = await db
    .select({
      targetMonth: appSettings.targetMonth,
      targetYear: appSettings.targetYear,
      deadline: appSettings.deadline,
    })
    .from(appSettings);

  if (deadline > new Date()) {
    // deadline later than now, do nothing
    return Response.json({ success: false, message: 'Deadline not reached' });
  }

  await updateAppSettingsToNextMonth(targetMonth, deadline);

  const requests = await db
    .select({
      mealRequestId: mealRequests.id,
      childId: mealRequests.childId,
      user: {
        email: users.email,
        firstName: users.firstName,
      },
      day: mealDays.day,
      month: mealDays.month,
      year: mealDays.year,
      type: mealDays.type,
    })
    .from(mealRequests)
    .innerJoin(users, eq(users.id, mealRequests.userId))
    .innerJoin(
      mealRequestMealDays,
      eq(mealRequests.id, mealRequestMealDays.mealRequestId),
    )
    .innerJoin(mealDays, eq(mealRequestMealDays.mealDayId, mealDays.id))
    .where(
      and(
        eq(mealDays.month, targetMonth),
        eq(
          mealDays.year,
          getYearFromTargetMonthAndYear(targetMonth, targetYear),
        ),
      ),
    );

  const { lottery, childrenEmails } = requests.reduce<{
    lottery: {
      lunch: { [date: string]: { childId: string; mealRequestId: string }[] };
      snacks: { [date: string]: { childId: string; mealRequestId: string }[] };
    };
    childrenEmails: { [childId: string]: Set<[string, string]> };
  }>(
    (acc, { childId, day, month, year, user, mealRequestId }) => {
      const date = `${year}-${month}-${day}`;
      const childEmails = acc.childrenEmails[childId]
        ? acc.childrenEmails[childId]
        : new Set<[string, string]>();
      childEmails.add([user.email, user.firstName ?? 'Anonymer Nutzer']);

      return {
        lottery: {
          lunch: {
            ...acc.lottery.lunch,
            [date]: [...acc.lottery.lunch[date], { childId, mealRequestId }],
          },
          snacks: {
            ...acc.lottery.snacks,
            [date]: [...acc.lottery.snacks[date], { childId, mealRequestId }],
          },
        },
        childrenEmails: {
          ...acc.childrenEmails,
          [childId]: childEmails,
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

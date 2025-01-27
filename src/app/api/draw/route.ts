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
    childrenEmails: {
      [childId: string]: { email: string; firstName: string }[];
    };
  }>(
    (acc, { childId, day, month, year, user, mealRequestId, type }) => {
      const date = `${year}-${month}-${day}`;
      const existingEmails = acc.childrenEmails[childId] || [];
      const newEmailEntry = {
        email: user.email,
        firstName: user.firstName ?? 'Anonymer Nutzer',
      };
      const hasExistingEntry = existingEmails.some(
        (entry) =>
          entry.email === newEmailEntry.email &&
          entry.firstName === newEmailEntry.firstName,
      );
      const childrenEmails = {
        ...acc.childrenEmails,
        [childId]: hasExistingEntry
          ? existingEmails
          : [...existingEmails, newEmailEntry],
      };

      if (type === 'lunch') {
        return {
          lottery: {
            ...acc.lottery,
            lunch: {
              ...acc.lottery.lunch,
              [date]: [
                ...(acc.lottery.lunch[date] ?? []),
                { childId, mealRequestId },
              ],
            },
          },
          childrenEmails,
        };
      }
      return {
        lottery: {
          ...acc.lottery,
          snacks: {
            ...acc.lottery.snacks,
            [date]: [
              ...(acc.lottery.snacks[date] ?? []),
              { childId, mealRequestId },
            ],
          },
        },
        childrenEmails,
      };
    },
    { lottery: { lunch: {}, snacks: {} }, childrenEmails: {} },
  );

  const { results: lunchResults } = draw({ openDraws: lottery.lunch });
  const preDrawResults = preDraw({
    openSnackDraws: lottery.snacks,
    lunchResults,
  });
  const { results: snackResults } = draw(preDrawResults);
  for (const [childId, emails] of Object.entries(childrenEmails)) {
    const assignedLunchDate = lunchResults[childId];
    const assignedSnackDate = snackResults[childId];
    const lunchText = assignedLunchDate
      ? `Gezogener Mittagessenstermin: ${new Date(assignedLunchDate.date).toLocaleDateString()}`
      : 'Leider konnte euch kein Mittagessenstermin zugewiesen werden.';
    const snackText = assignedSnackDate
      ? `Gezogener Jausentermin: ${new Date(assignedSnackDate.date).toLocaleDateString()}`
      : 'Leider konnte euch kein Jausentermin zugewiesen werden.';
    emails.forEach(async ({ email, firstName }) => {
      await sendEmail({
        to: email,
        subject: 'Die Essenslotterieergebnisse sind da!',
        text: `Hi ${firstName},\n\nDie Ergebnisse der Essenslotterie sind da:\n\n${lunchText}\n${snackText}\n\nBitte tragt wie gehabt euer Menü bei Google Sheets ein. Das Sheet ist ab jetzt verfügbar.`,
      });
    });
    if (assignedLunchDate) {
      await db
        .update(mealRequests)
        .set({ hasWon: true })
        .where(eq(mealRequests.id, assignedLunchDate.mealRequestId));
    }
    if (assignedSnackDate) {
      await db
        .update(mealRequests)
        .set({ hasWon: true })
        .where(eq(mealRequests.id, assignedSnackDate.mealRequestId));
    }

    // TODO add results to google docs
  }

  return Response.json({ success: true, status: 200 });
};

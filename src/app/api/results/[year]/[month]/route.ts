import db from '@/services/db';
import { children, mealDays, mealRequests } from '@/services/db/schema';
import getSpreadSheetDoc from '@/services/google-sheets';
import { and, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

type RouteParams = {
  params: {
    year: string;
    month: string;
  };
};

const cols = {
  snacks: 4,
  lunch: 5,
  date: 2,
};

const dateHeaderRow = 4;

export const POST = async (request: NextRequest, { params }: RouteParams) => {
  const { year, month } = params;
  const sheetName = `${year.slice(-2)}-${month}`;
  const doc = await getSpreadSheetDoc();
  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    return Response.json(
      { message: `Cannot access sheet ${sheetName}` },
      { status: 400 },
    );
  }
  await sheet.loadCells();
  const winners = await db
    .select({
      childName: children.name,
      month: mealDays.month,
      year: mealDays.year,
      day: mealDays.day,
      type: mealDays.type,
    })
    .from(mealRequests)
    .innerJoin(mealDays, eq(mealRequests.mealDayId, mealDays.id))
    .innerJoin(children, eq(mealRequests.childId, children.id))
    .where(
      and(
        eq(mealDays.year, parseInt(year)),
        eq(mealDays.month, parseInt(month)),
        eq(mealRequests.hasWon, true),
      ),
    );
  winners.forEach(({ day, childName, type }) => {
    const [gDay, gMonth] = (
      sheet.getCell(dateHeaderRow + day, cols.date).formattedValue ?? ''
    ).split('.');
    if (parseInt(gDay) !== day || parseInt(gMonth) !== parseInt(month)) {
      console.error(
        `Invalid sheet. Expected date: ${day}.${month}. Found: ${gDay}.${gMonth}`,
      );
      return;
    }
    try {
      const colIndex = cols[type];
      const cell = sheet.getCell(dateHeaderRow + day, colIndex);
      cell.stringValue = childName;
      cell.save();
    } catch (error) {
      console.error('Failed to update sheet:', error);
    } finally {
      sheet.saveUpdatedCells();
    }
  });

  return Response.json({
    message: `Updated sheet for ${month}.${year}`,
  });
};

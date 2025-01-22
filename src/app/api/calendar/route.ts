import db from '@/services/db';
import { mealDays } from '@/services/db/schema';
import getSpreadSheetDoc from '@/services/google-sheets';
import { isNonNullish } from '@/utils/objects';
import { sql } from 'drizzle-orm';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { NextResponse } from 'next/server';

const getNewMealItems = (cellValue: string | null, day: number) => {
  const normalizedValue = (cellValue ?? '').trim().toLowerCase();
  if (normalizedValue === 'x') {
    return [
      { day, type: 'lunch' as const },
      { day, type: 'snacks' as const },
    ];
  }
  if (normalizedValue === 'o') {
    return [{ day, type: 'snacks' as const }];
  }
  return [];
};

const getAvailableDaysForRow =
  (calendar: GoogleSpreadsheetWorksheet) => (row: number) => {
    const columnIndices = Array.from({ length: 31 }, (_, i) => 2 * i + 1);
    return columnIndices.reduce(
      (acc, columnIndex) => {
        const cellValue = calendar.getCell(row, columnIndex).formattedValue;
        return [
          ...acc,
          ...getNewMealItems(cellValue, (columnIndex - 1) / 2 + 1),
        ];
      },
      [] as {
        day: number;
        type: 'lunch' | 'snacks';
      }[],
    );
  };

const months = Array.from({ length: 12 }, (_, i) => (9 + i) % 12 || 12);
const rowIndices = Array.from({ length: 12 }, (_, i) => 3 + i * 3);

export const POST = async () => {
  try {
    const doc = await getSpreadSheetDoc();
    const calendar = doc.sheetsById[0];

    await calendar.loadCells();

    const firstCellValue = calendar.getCell(0, 0).formattedValue;
    const calYear = firstCellValue
      ? new Date(firstCellValue).getFullYear()
      : 2000;

    const availableDays = await Promise.all(
      rowIndices.map(getAvailableDaysForRow(calendar)),
    );
    const values = availableDays
      .flatMap((daysInMonth, index) => {
        const month = months.at(index);
        if (!month) {
          return null;
        }
        const year = month && month < 9 ? calYear + 1 : calYear;
        return daysInMonth.map(({ day, type }) => ({
          month,
          year,
          day,
          type,
        }));
      })
      .filter(isNonNullish);

    await db
      .insert(mealDays)
      .values(values)
      .onConflictDoUpdate({
        target: [mealDays.year, mealDays.month, mealDays.day, mealDays.type],
        set: {
          year: sql`excluded.year`,
          month: sql`excluded.month`,
          day: sql`excluded.day`,
          type: sql`excluded.meal_type`,
        },
      });

    return new NextResponse(null, { status: 201 });
  } catch (error) {
    console.error('Failed to fetch calendar data:', error);
    const message = error instanceof Error ? error.message : null;
    return NextResponse.json({ message }, { status: 500 });
  }
};

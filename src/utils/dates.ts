import { format } from 'date-fns';
import { deAT } from 'date-fns/locale';

export const getDate = (date: string | number | Date) => {
  return typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
};

export const getDateString = (date: Date) => format(date, 'yyyy-MM-dd');

export const getMonth = (dateString: string) => {
  const date = new Date(dateString);
  if (!date) {
    throw new Error('No date provided to getMonth');
  }
  return format(date, 'MMMM', { locale: deAT });
};

export const getMonthDateString = (date?: string | number | Date) => {
  if (!date) {
    throw new Error('No date provided to getMonthString');
  }
  return format(date, 'yyyy-MM');
};

export const getYearFromTargetMonthAndYear = (
  targetMonth: number,
  targetYear: number,
) => {
  return targetMonth && targetMonth < 9 ? targetYear + 1 : targetYear;
};

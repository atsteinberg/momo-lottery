import { format } from 'date-fns';
import { deAT } from 'date-fns/locale';

export const getDate = (date: string | number | Date) => {
  return typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
};

export const getDateString = (date: Date) => format(date, 'yyyy-MM-dd');

export const getMonth = (date?: string | number | Date) => {
  if (!date) {
    throw new Error('No date provided to getMonth');
  }
  return format(date, 'MMMM', { locale: deAT });
};

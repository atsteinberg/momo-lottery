import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { DateLike } from '../date-selection.client/date-selection.client';

type DateCardProps = PropsWithClassName<{
  date?: DateLike;
  availableDates?: Date[];
  month: Date;
  setDate: Dispatch<SetStateAction<DateLike>>;
}>;

const DateCard: FC<DateCardProps> = ({
  date,
  availableDates,
  className,
  month,
  setDate,
}) => {
  const [startOpen, setStartOpen] = useState(false);
  useEffect(() => {
    setStartOpen(false);
  }, [date]);
  if (date === undefined) {
    return (
      <Button
        variant="outline"
        className={cn('w-full h-10', className)}
        onClick={() => {
          setDate('new');
          setStartOpen(true);
        }}
      />
    );
  }
  return (
    <DatePicker
      setDate={(newDate) => setDate(newDate as DateLike)}
      date={date && date !== 'new' ? date : undefined}
      availableDates={availableDates}
      className={cn('w-full h-10', className)}
      month={month}
      startOpen={startOpen}
    />
  );
};

export default DateCard;

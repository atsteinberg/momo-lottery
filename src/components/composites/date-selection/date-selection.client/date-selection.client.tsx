'use client';

import IconButton from '@/components/ui/icon-button';
import Typography from '@/components/ui/typography';
import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { isSameDay } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { FC, useState } from 'react';
import DateCard from '../date-card/date-card';
import { DateSelectionConfig } from '../date-selection';

type DateSelectionClientProps = PropsWithClassName<{
  config: DateSelectionConfig;
  availableDates: Date[];
  selectedDates: Date[];
  month: Date;
}>;

export type DateLike = Date | null | 'new';

const canAddDate = (
  dates: DateLike[],
  availableDates: Date[],
  index?: number,
) =>
  dates.length < 5 &&
  dates.every((date) => date !== 'new' && date !== null) &&
  dates.length < availableDates.length &&
  (index === undefined || dates.length === index);

const DateSelectionClient: FC<DateSelectionClientProps> = ({
  config,
  className,
  availableDates,
  selectedDates,
  month,
}) => {
  const [dates, setDates] = useState<(Date | null | 'new')[]>(selectedDates);
  return (
    <div>
      <div
        className={cn(
          'flex flex-row justify-between items-center mb-4',
          className,
        )}
      >
        <Typography as="h4">{config.title}</Typography>

        <IconButton
          icon={<PlusCircle className="h-4 w-4" />}
          onClick={() => {
            setDates([...dates, null]);
          }}
          disabled={!canAddDate(dates, availableDates)}
        />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <DateCard
            key={index}
            date={dates[index]}
            availableDates={availableDates.filter((date) =>
              dates.every((day) => day === null || !isSameDay(day, date)),
            )}
            className="h-14"
            month={month}
            setDate={(date) => {
              if (date === null) {
                setDates((prev) => {
                  const newDates = [...prev];
                  newDates[index] = null;
                  return newDates.filter((date) => date !== null);
                });
                return;
              }
              if (date === 'new') {
                console.log(index);
                if (canAddDate(dates, availableDates, index)) {
                  setDates((prev) => {
                    const newDates = [...prev];
                    newDates[index] = null;
                    return newDates;
                  });
                }
              }
              if (typeof date === 'object') {
                setDates((prev) => {
                  const newDates = [...prev];
                  newDates[index] = date;
                  return newDates;
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DateSelectionClient;

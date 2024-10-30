'use client';

import IconButton from '@/components/ui/icon-button';
import Typography from '@/components/ui/typography';
import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { PlusCircle } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import DateCard from '../date-card/date-card';
import { DateSelectionConfig } from '../date-selection';

type DateSelectionClientProps = PropsWithClassName<{
  config: DateSelectionConfig;
  availableDates: Date[];
  selectedDates: Date[];
}>;

const getFirstAvailableDate = (
  availableDates: Date[],
  selectedDates: Date[],
) => {
  return availableDates
    .filter((date) => !selectedDates.includes(date))
    .sort((a, b) => a.getTime() - b.getTime())[0];
};

const DateSelectionClient: FC<DateSelectionClientProps> = ({
  config,
  className,
  availableDates,
  selectedDates,
}) => {
  const [dates, setDates] = useState<Date[]>(selectedDates);
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
            const firstAvailableDate = getFirstAvailableDate(
              availableDates,
              dates,
            );
            if (!firstAvailableDate) {
              toast.error('Es gibt keine verfügbaren Tage mehr');
              return;
            }
            setDates([...dates, firstAvailableDate]);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <DateCard key={index} date={dates[index]} className="h-14" />
        ))}
      </div>
    </div>
  );
};

export default DateSelectionClient;

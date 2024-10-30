'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format, isSameDay } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { deAT } from 'date-fns/locale';
import { Trash } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

type DatePickerProps = PropsWithClassName<{
  date?: Date;
  setDate: Dispatch<SetStateAction<Date | null>>;
  availableDates?: Date[];
  month: Date;
  startOpen?: boolean;
}>;

export function DatePicker({
  className,
  date,
  setDate,
  availableDates,
  month,
  startOpen,
}: DatePickerProps) {
  const [open, setOpen] = useState(startOpen ?? false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Button variant={'outline'} className="h-14">
        <PopoverTrigger asChild className="flex grow">
          <Button
            variant={'ghost'}
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon />
            {date ? (
              format(date, 'PPP', { locale: deAT })
            ) : (
              <span>Wähle ein Datum</span>
            )}
          </Button>
        </PopoverTrigger>
        {date && (
          <Button
            variant={'ghost'}
            className="right-0 h-14 z-50"
            onClick={() => {
              setDate(null);
              setOpen(false);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </Button>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date ?? null);
            setOpen(false);
          }}
          initialFocus
          defaultMonth={date}
          showOutsideDays={false}
          locale={deAT}
          month={month}
          disableNavigation
          disabled={(date) => {
            return (
              !availableDates ||
              availableDates?.every((availableDate) => {
                return !isSameDay(availableDate, date);
              })
            );
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

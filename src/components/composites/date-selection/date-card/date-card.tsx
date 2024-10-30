import { Button } from '@/components/ui/button';
import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { FC } from 'react';

type DateCardProps = PropsWithClassName<{
  date?: Date;
}>;

const DateCard: FC<DateCardProps> = ({ date, className }) => {
  if (!date)
    return (
      <Button variant="outline" className={cn('w-full h-10', className)} />
    );
  return (
    <Button
      variant="outline"
      className={cn('w-full justify-start h-10', className)}
    >
      {date.toLocaleDateString()}
    </Button>
  );
};

export default DateCard;

import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { FC } from 'react';

type DateSelectionProps = PropsWithClassName<{
  type: 'lunch' | 'snack';
}>;

const DateSelection: FC<DateSelectionProps> = ({ type, className }) => {
  return (
    <div className={cn('bg-card rounded-lg p-4', className)}>
      {type === 'lunch' ? 'Mittagessen' : 'Jause'}
    </div>
  );
};

export default DateSelection;

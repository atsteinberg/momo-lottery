import { Button } from '@/components/ui/button';
import { FC } from 'react';

type DateCardProps = {
  date?: Date;
};

const DateCard: FC<DateCardProps> = ({ date }) => {
  if (!date) return <Button variant="outline" className="w-full h-10" />;
  return (
    <Button variant="outline" className="w-full h-10 justify-start">
      {date.toLocaleDateString()}
    </Button>
  );
};

export default DateCard;

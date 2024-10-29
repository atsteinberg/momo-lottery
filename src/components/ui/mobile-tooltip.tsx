'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FC, PropsWithChildren, ReactNode, useState } from 'react';

type MobileTooltipProps = PropsWithChildren<{
  trigger: ReactNode;
}>;

const MobileTooltip: FC<MobileTooltipProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onTouchStart={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            e.preventDefault();
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(!isOpen);
            }
          }}
        >
          {trigger}
        </button>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-2 w-dvw sm:max-w-xl mp-4">
        {children}
      </TooltipContent>
    </Tooltip>
  );
};

export default MobileTooltip;

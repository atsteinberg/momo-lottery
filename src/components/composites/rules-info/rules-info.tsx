import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Typography from '@/components/ui/typography';
import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { Info } from 'lucide-react';
import { FC } from 'react';

const RulesInfo: FC<PropsWithClassName> = ({ className }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className={cn('h-4 w-4', className)} />
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-2 max-w-xl p-4">
        <Typography>
          Jedes Kind (bzw. dessen Eltern 😉) sollte im Kindergartenjahr
          durchschnittlich einmal im Monat für Jause und einmal im Monat fürs
          Mittagessen sorgen.
        </Typography>
        <Typography>Hier kann man im voraus Termine reservieren.</Typography>
        <Typography>
          Wähle einfach maximal 5 mögliche Termine für Jause und maximal 5
          mögliche Termine fürs Mittagessen. Jeweils ein Termin pro Kind wird
          vergeben, bevor die Essensliste live geht. Bei Konflikten entscheidet
          das Los. Sollte keiner der gewünschten Termine für Dich frei sein,
          wirst Du rechtzeitig per Email informiert.
        </Typography>
        <Typography>
          <Typography as="span" className="text-destructive">
            Wichtig:
          </Typography>{' '}
          Bitte trage wie gewohnt in jedem Fall das Menü in die Essensliste auf
          google sheets ein, sobald sie live geschaltet wurde.
        </Typography>
      </TooltipContent>
    </Tooltip>
  );
};

export default RulesInfo;

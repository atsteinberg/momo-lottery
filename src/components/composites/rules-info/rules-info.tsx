import MobileTooltip from '@/components/ui/mobile-tooltip';
import Typography from '@/components/ui/typography';
import db from '@/services/db';
import { appSettings } from '@/services/db/schema';
import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { Info } from 'lucide-react';
import { FC } from 'react';

const RulesInfo: FC<PropsWithClassName> = async ({ className }) => {
  const [{ deadline }] = await db
    .select({ deadline: appSettings.deadline })
    .from(appSettings);
  return (
    <MobileTooltip trigger={<Info className={cn('h-4 w-4', className)} />}>
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
        das Los. Über das Ergebnis wirst Du nach Ablauf der Deadline (derzeit
        zum Ende des {deadline.toLocaleDateString()}) per Email informiert.
      </Typography>
      <Typography>
        <Typography as="span" className="text-destructive">
          Wichtig:
        </Typography>{' '}
        Bitte trage wie gewohnt in jedem Fall das Menü in die Essensliste auf
        google sheets ein, sobald sie live geschaltet wurde.
      </Typography>
    </MobileTooltip>
  );
};

export default RulesInfo;

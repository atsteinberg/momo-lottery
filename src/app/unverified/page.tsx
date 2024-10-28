import LinkButton from '@/components/composites/link-button';
import Typography from '@/components/ui/typography';

const UnverifiedPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <Typography as="h3">
        Dein Account wurde noch nicht verifiziert.
      </Typography>
      <Typography>
        Bitte hab noch ein wenig Geduld und versuche es in ein paar Tagen noch
        einmal.
      </Typography>
      <LinkButton href="/">Versuch&apos;s noch einmal</LinkButton>
    </div>
  );
};

export default UnverifiedPage;

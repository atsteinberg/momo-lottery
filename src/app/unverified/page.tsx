import Typography from '@/components/ui/typography';

const UnverifiedPage = () => {
  return (
    <div>
      <Typography as="h3" className="mb-4">
        Dein Account wurde noch nicht verifiziert.
      </Typography>
      <Typography>
        Bitte hab noch ein wenig Geduld und versuche es in ein paar Tagen noch
        einmal.
      </Typography>
    </div>
  );
};

export default UnverifiedPage;

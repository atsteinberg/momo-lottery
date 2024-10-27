import Typography from '@/components/ui/typography';
import db from '@/services/db';
import SelectChild from './select-child';

const RegisterPage = async () => {
  const kids = await db.query.children.findMany();
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <div className="bg-slate-300 rounded-lg p-8 flex flex-col justify-center items-center shadow-md gap-4">
        <Typography as="h3">
          Sieht so aus, als wärst Du das erste Mal hier.
        </Typography>
        <Typography>Bitte verrate uns, wer Dein Kind ist!</Typography>
        <SelectChild kids={kids} />
      </div>
    </div>
  );
};

export default RegisterPage;

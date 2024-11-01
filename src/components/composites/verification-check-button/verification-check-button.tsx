'use client';

import { Button } from '@/components/ui/button';
import { PropsWithClassName } from '@/types/react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { toast } from 'sonner';
import { checkVerification } from './verification-check-button.actions';

const VerificationCheckButton: FC<PropsWithClassName> = ({ className }) => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        const verified = await checkVerification();
        if (!verified) {
          toast.info('Dein Account wurde noch nicht verifiziert.');
        } else {
          router.push('/');
        }
      }}
      className={className}
    >
      Versuch&apos;s noch einmal
    </Button>
  );
};

export default VerificationCheckButton;

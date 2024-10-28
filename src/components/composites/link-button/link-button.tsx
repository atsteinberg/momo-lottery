import { Button, ButtonProps } from '@/components/ui/button';
import Link from 'next/link';

type LinkButtonProps = ButtonProps & {
  href: string;
};

const LinkButton = ({ href, ...buttonProps }: LinkButtonProps) => {
  return (
    <Link href={href}>
      <Button {...buttonProps} />
    </Link>
  );
};

export default LinkButton;

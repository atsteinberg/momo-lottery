import { PropsWithClassName } from '@/types/react';
import { ButtonHTMLAttributes } from 'react';

type IconButtonProps = PropsWithClassName<
  {
    icon: React.ReactNode;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

const IconButton = ({ className, icon, ...props }: IconButtonProps) => {
  return (
    <button className={className} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;

import { PropsWithClassName } from '@/types/react';
import { cn } from '@/utils/tailwind';
import { SignedIn, SignOutButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { LogOut } from 'lucide-react';
import { FC } from 'react';

const Header: FC<PropsWithClassName> = async ({ className }) => {
  const user = await currentUser();
  return (
    <header
      className={cn(
        'py-4 bg-slate-100 flex justify-between items-center md:px-10 px-4',
        className
      )}
    >
      <div>
        <h3>Hi, {user?.firstName}!</h3>
      </div>
      <SignedIn>
        <SignOutButton redirectUrl="/">
          <LogOut className="cursor-pointer" />
        </SignOutButton>
      </SignedIn>
    </header>
  );
};

export default Header;

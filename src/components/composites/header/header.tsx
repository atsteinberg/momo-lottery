import { SignedIn, SignOutButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { LogOut } from 'lucide-react';

const Header = async () => {
  const user = await currentUser();
  return (
    <header className="py-4 bg-slate-100 flex justify-between items-center md:px-10 px-4">
      <div>
        <h3>Hi, {user?.firstName}!</h3>
      </div>
      <SignedIn>
        <SignOutButton>
          <LogOut className="cursor-pointer" />
        </SignOutButton>
      </SignedIn>
    </header>
  );
};

export default Header;

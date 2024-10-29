import { deDE } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { FC, PropsWithChildren } from 'react';

const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider localization={deDE}>
      <TooltipProvider>{children}</TooltipProvider>
    </ClerkProvider>
  );
};

export default GlobalContextProvider;

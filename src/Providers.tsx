import { ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { AppProvider } from './context';

const config = {
  useSystemColorMode: true,
};

export const Providers = ({ children }: { children: ReactNode }) => {
  const theme = extendTheme({ config });

  return (
    <Sentry.ErrorBoundary
      fallback={<p>An error occurred, please retry!</p>}
      showDialog
    >
      <ChakraProvider theme={theme}>
        <AppProvider>{children}</AppProvider>
      </ChakraProvider>
    </Sentry.ErrorBoundary>
  );
};

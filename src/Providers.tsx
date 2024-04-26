import { ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AppProvider } from './context';

const config = {
  useSystemColorMode: true,
}

export const Providers = ({ children }: { children: ReactNode }) => {
  const theme = extendTheme({ config })

  return (
    <ChakraProvider theme={theme}>
      <AppProvider>{children}</AppProvider>
    </ChakraProvider>
  );
};

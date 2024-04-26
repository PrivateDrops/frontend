import { ReactNode } from 'react';
import { Card } from '@chakra-ui/react';

export const ResponsiveCard = ({ children }: { children: ReactNode }) => {
  return (
    <Card
      minW={{ base: 'xs', md: 'sm', lg: 'md' }}
      minH={{ base: 'xs', md: 'sm', lg: 'md' }}
      maxW={{ base: 'sm', md: 'md', lg: 'lg' }}
      maxH={{ base: 'sm', md: 'md', lg: 'lg' }}
      direction="column"
      overflow="hidden"
      variant="outline"
      borderRadius="md"
    >
      {children}
    </Card>
  );
};

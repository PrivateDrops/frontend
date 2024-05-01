import { ReactNode } from 'react';
import { Card, useColorModeValue } from '@chakra-ui/react';

export const ResponsiveCard = ({ children }: { children: ReactNode }) => {
  const cardBackground = useColorModeValue('white', 'gray.700');

  return (
    <Card
      boxShadow="xl"
      rounded="lg"
      overflow="hidden"
      mx="auto"
      bg={cardBackground}
      minW={{ base: 'xs', md: 'sm', lg: 'md' }}
      minH={{ base: 'xs', md: 'sm', lg: 'md' }}
      maxW={{ base: 'sm', md: 'md', lg: 'lg' }}
      maxH={{ base: 'sm', md: 'md', lg: 'lg' }}
      direction="column"
      variant="outline"
      borderRadius="xl"
    >
      {children}
    </Card>
  );
};

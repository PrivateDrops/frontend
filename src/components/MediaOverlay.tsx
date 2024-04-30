import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

export const MediaProtectionLayer = ({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) => {
  if (enabled)
    return (
      <Box position="relative">
        {children}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="2"
          onClick={(e) => e.stopPropagation()}
        />
      </Box>
    );
  else return <>{children}</>;
};

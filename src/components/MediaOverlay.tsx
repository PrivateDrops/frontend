import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

export const MediaProtectionLayer = ({
  enabled,
  onFullScreenToggle,
  children,
}: {
  enabled: boolean;
  onFullScreenToggle?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  children: ReactNode;
}) => {
  return (
    <Box position="relative">
      {children}
      {enabled && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="2"
          onClick={(e) => {
            e.stopPropagation();
            onFullScreenToggle?.(e);
          }}
          style={{ cursor: 'pointer' }}
        />
      )}
    </Box>
  );
};

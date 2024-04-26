import { HStack, IconButton } from '@chakra-ui/react';
import { FaLockOpen, FaImages, FaUserCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export const FooterMenu = () => {
  const location = useLocation();

  return (
    <HStack
      justifyContent="center"
      spacing={6}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      p={6}
    >
      <IconButton
        fontSize={['lg', '2xl']}
        variant="ghost"
        colorScheme={location.pathname == '/upload' ? 'teal' : ''}
        aria-label="Upload"
        icon={<FaLockOpen />}
        isRound
        as="a"
        href="/upload"
      />
      <IconButton
        fontSize={['lg', '2xl']}
        variant="ghost"
        colorScheme={location.pathname == '/media' ? 'teal' : ''}
        aria-label="Media"
        icon={<FaImages />}
        isRound
        as="a"
        href="/media"
      />
      <IconButton
        fontSize={['lg', '2xl']}
        variant="ghost"
        colorScheme={location.pathname == '/profile' ? 'teal' : ''}
        aria-label="Profile"
        icon={<FaUserCircle />}
        isRound
        as="a"
        href="/profile"
      />
    </HStack>
  );
};

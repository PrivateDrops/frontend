import { ReactNode, useContext, useEffect, useState } from 'react';
import { Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context';

export const Auth = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, []);

  if (!accessToken) {
    return (
      <Center h="100vh" flexDirection="column" bg="gray.100">
        Checking Authentication...
      </Center>
    );
  }

  return (
    <Center h="100vh" flexDirection="column">
      {children}
    </Center>
  );
};

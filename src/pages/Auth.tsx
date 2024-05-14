import { ReactNode, useEffect } from 'react';
import { Center, Heading, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { sendGetRequest } from '../lib/request';

export const Auth = ({ children }: { children: ReactNode }) => {
  const { accessToken, clear } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { success } = await sendGetRequest('user', accessToken);
      if (!success) {
        clear();
        navigate('/login');
      }
    };

    load();
  }, [accessToken]);

  if (!accessToken) {
    return (
      <Center h="100vh" flexDirection="column">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
        <Heading size="md" mt="4">
          Checking Authentication...
        </Heading>
      </Center>
    );
  }

  return (
    <Center h="100vh" flexDirection="column">
      {children}
    </Center>
  );
};

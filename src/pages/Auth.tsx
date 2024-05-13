import { ReactNode, useContext, useEffect, useState } from 'react';
import { Center, Heading, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context';
import { sendGetRequest } from '../lib/request';

export const Auth = ({ children }: { children: ReactNode }) => {
  const { accessToken, clear } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const maxRetries = 5;
  const retryDelay = 3000; // 3 second delay

  useEffect(() => {
    const load = async (retryCount = 0) => {
      try {
        const { success } = await sendGetRequest('user', accessToken);
        setLoading(false);
        if (!success) {
          clear();
          navigate('/login');
        }
      } catch (err) {
        if (retryCount < maxRetries) {
          setTimeout(() => load(retryCount + 1), retryDelay);
        } else {
          clear();
          navigate('/login');
        }
      }
    };

    if (accessToken) {
      load();
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [accessToken, clear, navigate]);

  if (loading) {
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

  if (!accessToken) {
    return null;
  }

  return (
    <Center h="100vh" flexDirection="column">
      {children}
    </Center>
  );
};

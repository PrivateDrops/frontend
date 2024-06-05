import { ReactNode, useContext, useEffect } from 'react';
import { Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context';
import { sendGetRequest } from '../lib/request';

export const Auth = ({ children }: { children: ReactNode }) => {
  const { accessToken, saveUser, clear } = useContext(AppContext);
  const navigate = useNavigate();

  const maxRetries = 5;
  const retryDelay = 3000; // 3 second delay

  useEffect(() => {
    const load = async (retryCount = 0) => {
      try {
        const { success, response } = await sendGetRequest('user', accessToken);
        if (!success) {
          clear();
          navigate('/login');
        } else {
          saveUser(response);
          if (response.banned) {
            clear();
            navigate('/banned');
          }

          if (!response.stripeAccountId || !response.stripeVerified)
            navigate('/onboarding');
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
      navigate('/login');
    }
  }, [accessToken, clear, navigate]);

  return (
    <Center h="100vh" flexDirection="column">
      {children}
    </Center>
  );
};

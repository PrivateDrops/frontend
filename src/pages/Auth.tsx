import { ReactNode, useContext, useEffect } from 'react';
import { Center, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context';
import { sendGetRequest } from '../lib/request';

export const Auth = ({ children }: { children: ReactNode }) => {
  const { accessToken, saveUser, clear } = useContext(AppContext);
  const navigate = useNavigate();
  const toast = useToast();

  const maxRetries = 5;
  const retryDelay = 3000; // 3 second delay

  const performKyc = async () => {
    const { response, success } = await sendGetRequest(
      'payment/kyc',
      accessToken,
    );
    if (success) {
      window.location.href = response;
      toast({
        title: 'Redirecting you to the verification page...',
        duration: 2000,
        isClosable: true,
        status: 'info',
      });
    } else {
      toast({
        title: 'Error getting verification link',
        description:
          response?.error ||
          response?.message[0] ||
          'An unexpected error occurred',
        duration: 3000,
        isClosable: true,
        status: 'error',
      });
    }
  };

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
          } else if (!response.stripeVerified) {
            await performKyc();
          }
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

import { Center, Heading, Spinner, useToast } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { AppContext } from '../context';
import { sendGetRequest } from '../lib/request';
import { errorFormatter } from '../lib/helpers';

const InterceptLogin = () => {
  const { nonce } = useParams();
  const navigate = useNavigate();
  const { accessToken, saveAccessToken } = useContext(AppContext);
  const toast = useToast();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: '/login/:nonce',
      title: 'InterceptLogin',
    });
  }, []);

  useEffect(() => {
    if (accessToken !== '') {
      navigate('/upload');
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    const init = async () => {
      if (nonce && nonce.length > 5) {
        const { response, success } = await sendGetRequest(
          'auth/login/' + nonce,
          '',
        );
        if (success) {
          if (response.banned) {
            toast({
              title: 'Banned',
              duration: 3000,
              isClosable: true,
              status: 'error',
            });
            navigate('/banned');
          } else {
            saveAccessToken(response.accessToken);
            toast({
              title: 'Login successful',
              duration: 2000,
              isClosable: true,
              status: 'success',
            });

            ReactGA.event({
              category: 'Intercept Login Page',
              action: 'user logged in',
            });
          }
        } else {
          toast({
            title: 'An error occurred',
            description: errorFormatter(response),
            duration: 3000,
            isClosable: true,
            status: 'error',
          });
          navigate('/login');
        }
      } else {
        toast({
          title: 'Invalid code',
          duration: 3000,
          isClosable: true,
          status: 'error',
        });
        navigate('/login');
      }
    };

    init();
  }, [nonce, navigate, toast, saveAccessToken]);

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
        Logging in...
      </Heading>
    </Center>
  );
};

export default InterceptLogin;

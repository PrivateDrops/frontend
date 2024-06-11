import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Center, Heading, Spinner, useToast } from '@chakra-ui/react';
import ReactGA from 'react-ga4';

const InterceptVerifcation = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: '/verification',
      title: 'InterceptVerification',
    });
  }, []);

  useEffect(() => {
    const status = queryParams.get('success');

    if (status === 'true') {
      toast({
        title: 'User Confirmed',
        duration: 2000,
        isClosable: true,
        status: 'success',
      });
      ReactGA.event({
        category: 'Intercept Verifcation Page',
        action: 'user account verified',
      });
      navigate('/profile');
    } else {
      toast({
        title: 'User not confirmed',
        description: 'Please retry',
        duration: 3000,
        isClosable: true,
        status: 'error',
      });
      navigate('/profile');
    }
  }, [queryParams, toast]);

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
        Validating status...
      </Heading>
    </Center>
  );
};

export default InterceptVerifcation;

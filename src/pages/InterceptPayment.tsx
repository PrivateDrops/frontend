import { useEffect } from 'react';
import { Center, Heading, Spinner, useToast } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { sendGetRequest } from '../lib/request';

const InterceptPayment = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: '/payment',
      title: 'InterceptPayment',
    });
  }, []);

  const paymentConfirmed = async (code: string) => {
    const { response, success } = await sendGetRequest(
      `payment/verify/${code}`,
    );
    if (success) return response;
    else return false;
  };

  useEffect(() => {
    const status = queryParams.get('success');
    const code = queryParams.get('code');

    if (code && status === 'true') {
      const intervalId = setInterval(async () => {
        const result = await paymentConfirmed(code);
        if (result) {
          clearInterval(intervalId);
          toast({
            title: 'Payment Confirmed',
            description: 'Your payment was successfully verified.',
            duration: 2000,
            isClosable: true,
            status: 'success',
          });
          ReactGA.event({
            category: 'Intercept Payment Page',
            action: 'payment verified',
          });
          navigate(`/view/${code}`);
        }
      }, 3000); // Polls every 3 seconds

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        toast({
          title: 'Payment Error',
          description: 'Unable to verify payment within the expected time.',
          duration: 3000,
          isClosable: true,
          status: 'warning',
        });
        navigate(code ? `/view/${code}` : '/');
      }, 60000); // Stops polling after 1 minute

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    } else {
      toast({
        title: 'Payment Cancelled',
        duration: 3000,
        isClosable: true,
        status: 'error',
      });

      navigate(code ? `/view/${code}` : '/');
    }
  }, [queryParams, navigate, toast]);

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
        Validating payment...
      </Heading>
    </Center>
  );
};

export default InterceptPayment;

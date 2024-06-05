import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CardBody,
  Center,
  Divider,
  Heading,
  Select,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { AppContext } from '../context';
import { sendGetRequest, sendPostRequest } from '../lib/request';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { supportedCountries } from '../supportedCountries';

const OnboardingPage = () => {
  const [step, setStep] = useState<number>(0);
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { accessToken, clear } = useContext(AppContext);

  const createStripeAccount = async () => {
    setLoading(true);
    const { success, response } = await sendPostRequest(
      'user/stripe',
      { country },
      accessToken,
    );
    if (success) {
      toast({
        title: 'Account created successfully',
        duration: 2000,
        isClosable: true,
        status: 'success',
      });
      setStep(1);
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
    setLoading(false);
  };

  const performKyc = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      const { success, response } = await sendGetRequest('user', accessToken);
      if (!success) {
        clear();
        navigate('/login');
      }
      if (!response.stripeAccountId || response.stripeAccountId == '') {
        setStep(0);
      } else if (!response.stripeVerified) {
        setStep(1);
      } else {
        navigate('/profile');
      }
    };

    if (accessToken) load();
  }, [accessToken]);

  return (
    <Center h="100vh" flexDirection="column">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <ResponsiveCard>
          <CardBody>
            <VStack spacing={5} align="stretch">
              <Heading size="md">Account Onboarding</Heading>
              <Text size="sm">
                Complete this quick process and start earning
              </Text>
              <Divider />
              {step === 0 ? (
                <>
                  <Select
                    placeholder="Choose your country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {supportedCountries.map((c: any, index: number) => (
                      <option key={index} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                  <Button
                    colorScheme="green"
                    onClick={createStripeAccount}
                    disabled={loading}
                  >
                    Create account
                  </Button>
                </>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={performKyc}
                  disabled={loading}
                >
                  Proceed to onboarding
                </Button>
              )}
            </VStack>
          </CardBody>
        </ResponsiveCard>
      </Box>
    </Center>
  );
};

export default OnboardingPage;

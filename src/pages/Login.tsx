import { useState, useEffect, useContext, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaCheck } from 'react-icons/fa6';
import { AppContext } from '../context';
import { sendPostRequest } from '../lib/request';

const LoginPage = () => {
  const [honeypot, setHoneypot] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [sent, setEmailSent] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { accessToken } = useContext(AppContext);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sent && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setEmailSent(false);
    }
    return () => clearInterval(interval);
  }, [sent, timeLeft]);

  useEffect(() => {
    if (accessToken !== '') {
      navigate('/upload');
    }
  }, [accessToken, navigate]);

  const isValidEmail = () => {
    return email.length > 2 && validator.isEmail(email);
  };

  const sendEmailCode = async () => {
    if (honeypot !== '' || !isValidEmail()) {
      return;
    }
    const token = await recaptchaRef.current?.executeAsync();
    const { success, response } = await sendPostRequest(
      'auth/login',
      { email },
      accessToken,
      { recaptcha: token },
    );
    if (success) {
      setEmailSent(true);
      setTimeLeft(60);
    } else {
      console.log('response', response);
      toast({
        title: 'Login failed',
        description:
          response?.error ||
          (response?.message && response?.message[0]) ||
          response,
        duration: 2000,
        isClosable: true,
        status: 'error',
      });
    }
  };

  return (
    <Center h="100vh" flexDirection="column">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        />
        <Card maxW="md" w="full" boxShadow="xl" borderRadius="lg">
          <CardBody>
            <VStack spacing={4}>
              <Heading size="lg">Login</Heading>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <input
                  type="hidden"
                  name="favorite_color"
                  value=""
                  aria-hidden="true"
                  onChange={(e) => setHoneypot(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="louis.lafoe@gmail.com"
                  isDisabled={sent}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
                <FormHelperText>
                  <Icon as={FaCheck} />
                  &nbsp;By logging in you accept our&nbsp;
                  <Text as="a" fontWeight={'bold'} href="/tos">
                    ToS
                  </Text>
                </FormHelperText>
              </FormControl>
              {!sent ? (
                <Button
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isDisabled={!isValidEmail()}
                  onClick={sendEmailCode}
                >
                  Send Email
                </Button>
              ) : (
                <>
                  <Divider />
                  <VStack spacing={2}>
                    <Text>Click on the link you just received to login.</Text>
                    {timeLeft > 0 ? (
                      <Text fontSize="sm" color="gray.500">
                        Please wait {timeLeft} seconds to resend.
                      </Text>
                    ) : (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        width="full"
                        isDisabled={!isValidEmail()}
                        onClick={sendEmailCode}
                      >
                        Resend Email
                      </Button>
                    )}
                  </VStack>
                </>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Center>
  );
};

export default LoginPage;

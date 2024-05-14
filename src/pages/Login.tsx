import { useState, useEffect, useRef } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaCheck } from 'react-icons/fa6';
import { useAuth } from '../context';
import { sendPostRequest } from '../lib/request';

const LoginPage = () => {
  const [honeypot, setHoneypot] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [sent, setEmailSent] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { accessToken } = useAuth();
  const recaptchaRef = useRef<any>();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;
    if (sent && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
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
    if (honeypot !== '') {
      return;
    }

    if (!isValidEmail) return;

    recaptchaRef.current.execute();

    const { success } = await sendPostRequest(
      'auth/login',
      { email },
      accessToken,
    );
    if (!success) return;

    setEmailSent(true);
    setTimeLeft(60);
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
          sitekey="6Lch2CsUAAAAAHLmH4oypQ886v2500r2mcMLcbLl"
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

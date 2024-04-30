import { useState, useEffect, useContext } from 'react';
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
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { AppContext } from '../context';
import { sendPostRequest } from '../lib/request';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [sent, setEmailSent] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { accessToken } = useContext(AppContext);
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
    if (!isValidEmail) return;

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
        <Card maxW="sm" w="full" boxShadow="xl" borderRadius="lg">
          <CardBody>
            <VStack spacing={4}>
              <Heading size="lg">Login</Heading>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  isDisabled={sent}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
                <FormHelperText>
                  By logging in you accept our{' '}
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

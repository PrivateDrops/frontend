import { Center, Heading, Spinner, useToast } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context';
import { sendGetRequest } from '../lib/request';

const InterceptLogin = () => {
  const { nonce } = useParams();
  const navigate = useNavigate();
  const { accessToken, saveAccessToken, saveId, saveNickname } =
    useContext(AppContext);
  const toast = useToast();

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
          saveId(response.id);
          saveAccessToken(response.accessToken);
          saveNickname(response.nickname);
          toast({
            title: 'Login successful',
            duration: 2000,
            isClosable: true,
            status: 'success',
          });
        } else {
          toast({
            title: 'An error occurred',
            description:
              response?.error ||
              response?.message[0] ||
              "Can't login, please retry",
            duration: 2000,
            isClosable: true,
            status: 'error',
          });
          navigate('/login');
        }
      } else {
        toast({
          title: 'Invalid code',
          duration: 2000,
          isClosable: true,
          status: 'error',
        });
        navigate('/login');
      }
    };

    init();
  }, [nonce, navigate, toast, saveAccessToken, saveId, saveNickname]);

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

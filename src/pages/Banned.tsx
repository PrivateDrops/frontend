import { useEffect } from 'react';
import { Center, Heading, Icon, Text } from '@chakra-ui/react';
import { FaBan } from 'react-icons/fa6';
import ReactGA from 'react-ga4';

const BannedPage = () => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/banned', title: 'Banned' });
  }, []);

  return (
    <Center h="100vh" flexDirection="column">
      <Icon as={FaBan} color={'red.600'} boxSize={35} />
      <Heading size="md" mt="4">
        You have been banned from the service!
      </Heading>
      <Text>
        Uploading prohibited media resulted in your account termination.
      </Text>
    </Center>
  );
};

export default BannedPage;

// Import Chakra UI components
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Box position="relative" height="100vh" width="100vw" overflow="hidden">
      <Box
        position="absolute"
        height="full"
        width="full"
        backgroundImage="url(https://assets.imgix.net/unsplash/citystreet.jpg?w=1600&auto=compress)"
        backgroundPosition="center top"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter="blur(15px)"
        zIndex="-1"
      />
      <VStack
        spacing={6}
        position="relative"
        height="full"
        width="full"
        align="center"
        justify="center"
        textAlign="center"
        p={8}
        color="white"
        fontWeight={800}
      >
        <Heading as="h1" size="3xl" fontWeight="bold" id="title">
          Send a file, they"ll <br />
          pay to unlock it!
        </Heading>
        <Text fontSize="xl" id="subtitle">
          A Simple and Secure Way to Share and Monetise Your Files
        </Text>
        <Button colorScheme="green" as="a" href="/upload">
          Try now&nbsp;$$$
        </Button>
      </VStack>
    </Box>
  );
};

export default HomePage;

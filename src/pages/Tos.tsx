import { useEffect } from 'react';
import {
  Box,
  CardBody,
  Center,
  Divider,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Text,
} from '@chakra-ui/react';
import ReactGA from 'react-ga4';
import { ResponsiveCard } from '../components/ResponsiveCard';

const TosPage = () => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/tos', title: 'Tos' });
  }, []);

  return (
    <Center h="100vh" flexDirection="column">
      <Box textAlign="center">
        <ResponsiveCard>
          <CardBody>
            <Heading>Terms of Service</Heading>
            <Divider mt={4} mb={4} />
            <Stack
              spacing={4}
              maxH="60vh"
              overflowY="auto"
              sx={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                // MS Edge and Internet Explorer
                '-ms-overflow-style': 'none',
                // Firefox
                'scrollbar-width': 'none',
              }}
            >
              <OrderedList>
                <ListItem>
                  <Text fontWeight="bold">Prohibited Activities:</Text>
                  As a user of this platform, you agree not to engage in any
                  unlawful activities. Specifically, you must not upload or
                  share media that involves: Minors in any compromising or
                  explicit situations. Acts of violence or torture.
                  Non-consensual or revenge pornography. Any content that you do
                  not have explicit rights or permissions to use.
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Copyright and Ownership:</Text>
                  You affirm that you hold all necessary rights, licenses, and
                  permissions for any media you upload to our platform.
                  Uploading media for which you do not hold these rights is
                  strictly prohibited and may result in termination of your
                  account and legal action.
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">
                    Notification of Personal Detail Changes:
                  </Text>
                  You agree to promptly notify Impossible Labs Ltd. of any
                  changes to your personal details required for Know Your Client
                  (KYC) compliance. Timely updating of this information is
                  essential for maintaining your account's integrity and
                  legality. By accepting these terms, you commit to adhering to
                  the guidelines set forth above and understand that violation
                  of these terms may result in the suspension or termination of
                  your account and possible legal consequences.
                </ListItem>
              </OrderedList>
            </Stack>
          </CardBody>
        </ResponsiveCard>
      </Box>
    </Center>
  );
};

export default TosPage;

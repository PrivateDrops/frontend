import { useContext, useEffect, useState } from 'react';
import {
  Editable,
  EditableInput,
  EditablePreview,
  VStack,
  Divider,
  List,
  ListItem,
  Text,
  CardBody,
  Button,
  Stack,
  useToast,
  Select,
} from '@chakra-ui/react';
import { FooterMenu } from '../components/FooterMenu';
import { sendGetRequest } from '../lib/request';
import { Auth } from './Auth';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { AppContext } from '../context';

const ProfilePage = () => {
  const [user, setUser] = useState<any>();
  const [payout, setPayout] = useState<string>('');
  const [averageRating, setAverageRating] = useState<number>(0);
  const toast = useToast();
  const { accessToken } = useContext(AppContext);

  const requestPayout = async () => {
    if (payout == 'bank') {
      const { response, success } = await sendGetRequest(
        'payment/kyc',
        accessToken,
      );
      if (success) window.location.href = response;
      else {
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
    }
  };

  useEffect(() => {
    const load = async () => {
      const { response, success } = await sendGetRequest('user', accessToken);
      if (!success) {
        toast({
          title: 'Error getting user data',
          description:
            response?.error ||
            response?.message[0] ||
            'An unexpected error occurred',
          duration: 2000,
          isClosable: true,
          status: 'error',
        });
        return;
      }

      setUser(response);
      const ratings = response.ratings;
      setAverageRating(calculateAverage(ratings));
    };

    load();
  }, []);

  const calculateAverage = (ratings: number[]) => {
    if (ratings.length === 0) {
      return 0;
    }
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return sum / ratings.length;
  };

  return (
    <Auth>
      {user && (
        <>
          <ResponsiveCard>
            <CardBody>
              <VStack spacing={5} align="stretch">
                <Editable
                  fontSize="2xl"
                  defaultValue="Click to add nickname"
                  value={user.nickname || 'Click to add nickname'}
                  textAlign="center"
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Divider />
                <List spacing={4}>
                  <ListItem>
                    <Text fontSize="lg">
                      Avg Rating:{' '}
                      <Text as="span" fontWeight="bold">
                        {averageRating.toFixed(2)}
                        <small style={{ fontSize: 'sm', fontWeight: 'normal' }}>
                          {' '}
                          over {user.ratings.length} reviews
                        </small>
                      </Text>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="lg">
                      Balance:{' '}
                      <Text as="span" fontWeight="bold">
                        {(user.payouts / 100).toFixed(2)}€
                      </Text>
                    </Text>
                  </ListItem>
                </List>
                <Divider />
                {user.payouts > 2000 ? (
                  <>
                    <Text fontWeight={'bold'}>Payout</Text>
                    <Stack spacing={0}>
                      <Select onChange={(e) => setPayout(e.target.value)}>
                        <option>Choose payment method...</option>
                        <option value="gift">Gift card</option>
                        <option value="crypto">Crypto</option>
                        <option value="bank">Bank transfer</option>
                      </Select>
                      {payout == 'bank' && (
                        <Text fontSize={'sm'}>
                          You will need to provide personal info
                        </Text>
                      )}
                      {payout == 'crypto' && (
                        <Text fontSize={'sm'}>
                          Payment will be in USDC on Arbitrum
                        </Text>
                      )}
                      {payout && (
                        <Button
                          mt={2}
                          colorScheme="green"
                          onClick={requestPayout}
                        >
                          Continue
                        </Button>
                      )}
                    </Stack>
                  </>
                ) : (
                  <Text fontWeight={'bold'} colorScheme={'yellow.400'}>
                    Need to have at least 20€ to request a payout
                  </Text>
                )}
              </VStack>
            </CardBody>
          </ResponsiveCard>
          <FooterMenu />
        </>
      )}
    </Auth>
  );
};

export default ProfilePage;

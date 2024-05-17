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
  useToast,
} from '@chakra-ui/react';
import { FooterMenu } from '../components/FooterMenu';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { PayoutForm } from '../components/PayoutForm';
import { AppContext } from '../context';
import { sendGetRequest, sendPostRequest } from '../lib/request';
import { Auth } from './Auth';
import { valueFormatter } from '../lib/helpers';

export type User = {
  id: string;
  nickname?: string;
  email: string;
  currency: string;
  stripeVerified: boolean;
  banned: boolean;
  payouts: number;
  ratings: number[];
  createdAt: Date;
  updatedAt: Date;
};

const ProfilePage = () => {
  const [user, setUser] = useState<User>();
  const [nickname, setNickname] = useState<string>('');
  const [averageRating, setAverageRating] = useState<number>(0);
  const { accessToken } = useContext(AppContext);
  const toast = useToast();

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
      setNickname(response.nickname);
      setAverageRating(calculateAverage(response.ratings));
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

  const updateNickname = async () => {
    const { response, success } = await sendPostRequest(
      'user/nickname',
      { nickname },
      accessToken,
    );

    if (success)
      toast({
        title: 'Nickname updated',
        duration: 2000,
        isClosable: true,
        status: 'success',
      });
    else
      toast({
        title: 'Update nickname failed',
        description:
          response?.error ||
          response?.message[0] ||
          'An unexpected error occurred',
        duration: 2000,
        isClosable: true,
        status: 'error',
      });
  };

  return (
    <Auth>
      {user && (
        <>
          <ResponsiveCard>
            <CardBody>
              <VStack spacing={5} align="stretch">
                <Editable
                  submitOnBlur={true}
                  fontSize="2xl"
                  defaultValue="Click to add nickname"
                  textAlign="center"
                  value={nickname}
                  onSubmit={updateNickname}
                  onChange={(value) => setNickname(value)}
                  autoCapitalize="false"
                  spellCheck="false"
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Divider />
                <List spacing={4}>
                  <ListItem>
                    <Text fontSize="lg">
                      Avg Rating:&nbsp;
                      <Text as="span" fontWeight="bold">
                        {averageRating.toFixed(2)}
                        <small style={{ fontSize: 'sm', fontWeight: 'normal' }}>
                          &nbsp; over {user.ratings.length} reviews
                        </small>
                      </Text>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="lg">
                      Balance:&nbsp;
                      <Text as="span" fontWeight="bold">
                        {valueFormatter(user.payouts / 100, user.currency)}
                      </Text>
                    </Text>
                  </ListItem>
                </List>
                <Divider />
                {user.payouts > 2000 ? (
                  <PayoutForm accessToken={accessToken} user={user} />
                ) : (
                  <Text fontWeight={'bold'} colorScheme={'yellow.400'}>
                    Need to have at least {valueFormatter(20, user.currency)} to
                    request a payout
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

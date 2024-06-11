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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
} from '@chakra-ui/react';
import ReactGA from 'react-ga4';
import { FooterMenu } from '../components/FooterMenu';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { AppContext } from '../context';
import { sendGetRequest, sendPostRequest } from '../lib/request';
import { errorFormatter, valueFormatter } from '../lib/helpers';
import { Auth } from './Auth';

const ProfilePage = () => {
  const [nickname, setNickname] = useState<string>('');
  const [averageRating, setAverageRating] = useState<number>(0);
  const [balanceAvailable, setBalanceAvailable] = useState<number>(0);
  const [balancePending, setBalancePending] = useState<number>(0);
  const [balanceTransactions, setBalanceTransactions] = useState<any[]>([]);
  const { accessToken, user } = useContext(AppContext);
  const toast = useToast();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/profile', title: 'Profile' });
  }, []);

  useEffect(() => {
    const load = async () => {
      setAverageRating(calculateAverage(user.ratings));

      const { response, success } = await sendGetRequest(
        'payment/payouts',
        accessToken,
      );
      if (!success) {
        toast({
          title: 'Error getting user data',
          description: errorFormatter(response),
          duration: 3000,
          isClosable: true,
          status: 'error',
        });
        return;
      } else {
        const totalAmount = response.balanceInfo.available.reduce(
          (total: number, item: any) => {
            return total + item.amount;
          },
          0,
        );
        const totalPendingAmount = response.balanceInfo.pending.reduce(
          (total: number, item: any) => {
            return total + item.amount;
          },
          0,
        );

        setBalanceAvailable(totalAmount);
        setBalancePending(totalPendingAmount);
        setBalanceTransactions(response.balanceTransactions.data);
        console.log(response.balanceTransactions.data);
      }
    };

    if (user.id != '') load();
  }, [user]);

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
        description: errorFormatter(response),
        duration: 3000,
        isClosable: true,
        status: 'error',
      });
  };

  return (
    <Auth>
      {user.id != '' && (
        <>
          <ResponsiveCard>
            <CardBody>
              <VStack spacing={5} align="stretch">
                <Editable
                  submitOnBlur={true}
                  fontSize="2xl"
                  defaultValue="Click to add nickname"
                  textAlign="center"
                  value={user.nickname}
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
                      </Text>
                      <small>&nbsp;over {user.ratings.length} reviews</small>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="lg">
                      Balance:&nbsp;
                      <Text as="span" fontWeight="bold">
                        {valueFormatter(
                          balancePending + balanceAvailable,
                          user.currency,
                        )}
                      </Text>
                      <small>
                        &nbsp;of which{' '}
                        {valueFormatter(balanceAvailable, user.currency)}{' '}
                        available
                      </small>
                    </Text>
                  </ListItem>
                </List>
                <Divider />
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Status</Th>
                        <Th>Amount</Th>
                        <Th>Unlock time</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {balanceTransactions.map((tx: any, index: number) => (
                        <Tr key={index}>
                          <Td>
                            <Badge
                              colorScheme={
                                tx.status == 'pending' ? 'yellow' : 'green'
                              }
                            >
                              {tx.status}
                            </Badge>
                          </Td>
                          <Td>{valueFormatter(tx.net, tx.currency)}</Td>
                          <Td>
                            {new Date(
                              tx.available_on * 1000,
                            ).toLocaleDateString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
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

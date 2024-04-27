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
  CardFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { FooterMenu } from '../components/FooterMenu';
import { sendGetRequest } from '../lib/request';
import { Auth } from './Auth';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { AppContext } from '../context';

const ProfilePage = () => {
  const [user, setUser] = useState<any>();
  const [averageRating, setAverageRating] = useState<number>(0);
  const toast = useToast();
  const { accessToken } = useContext(AppContext);

  useEffect(() => {
    const load = async () => {
      const { response, success } = await sendGetRequest('user', accessToken);
      if (!success) {
        toast({
          title: 'Error getting user data',
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
                  fontSize="xl"
                  defaultValue="Change your nickname"
                  value={user.nickname}
                  textAlign="center"
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Divider />
                <List spacing={3}>
                  <ListItem>
                    <Text fontSize="lg">
                      Rating:{' '}
                      <Text as="span" fontWeight="semibold">
                        {averageRating.toFixed(2)}{' '}
                        <small>got over {user.ratings.length} reviews</small>
                      </Text>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="lg">
                      Balance:{' '}
                      <Text as="span" fontWeight="semibold">
                        {(user.payouts / 100).toFixed(2)}€
                      </Text>
                    </Text>
                  </ListItem>
                </List>
              </VStack>
            </CardBody>
            <CardFooter>
              <Stack>
                <FormControl id="iban">
                  <FormLabel>IBAN for Withdrawal</FormLabel>
                  <Input type="text" placeholder="Enter your IBAN" />
                  <FormHelperText>
                    Enter the IBAN to which the balance will be transferred.
                  </FormHelperText>
                </FormControl>
                <Button colorScheme="blue" mt={4}>
                  Withdraw to Bank Account
                </Button>
              </Stack>
            </CardFooter>
          </ResponsiveCard>
          <FooterMenu />
        </>
      )}
    </Auth>
  );
};

export default ProfilePage;

import { useState } from 'react';
import { Button, Select, Stack, Text, useToast } from '@chakra-ui/react';
import { sendGetRequest, sendPostRequest } from '../lib/request';
import { User } from '../pages/Profile';

export const PayoutForm = ({
  accessToken,
  user,
}: {
  accessToken: string;
  user: User;
}) => {
  const [payout, setPayout] = useState<string>('');
  const toast = useToast();

  const performKyc = async () => {
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
  };

  const requestPayout = async () => {
    const { success } = await sendPostRequest(
      'payment/payout',
      {},
      accessToken,
    );
    if (success)
      toast({
        title: 'Bank transfer is on the way',
        duration: 2000,
        isClosable: true,
        status: 'success',
      });
    else
      toast({
        title: 'An error occurred, retry',
        duration: 3000,
        isClosable: true,
        status: 'error',
      });
  };

  return (
    <>
      <Text fontWeight={'bold'}>Payout</Text>
      <Stack spacing={0}>
        <Select onChange={(e) => setPayout(e.target.value)}>
          <option>Choose payment method...</option>
          <option value="crypto">Crypto</option>
          <option value="bank">Bank transfer</option>
        </Select>
        {payout == 'bank' && (
          <>
            {user.stripeVerified ? (
              <Button mt={2} colorScheme="green" onClick={requestPayout}>
                Continue
              </Button>
            ) : (
              <>
                <Text fontSize={'sm'}>
                  You will need to provide personal details
                </Text>
                <Button mt={2} colorScheme="green" onClick={performKyc}>
                  Continue
                </Button>
              </>
            )}
          </>
        )}
        {payout == 'crypto' && (
          <Text fontSize={'sm'}>Payment will be in USDC on Arbitrum</Text>
        )}
      </Stack>
    </>
  );
};

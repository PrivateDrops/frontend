import {
  Box,
  Center,
  Image,
  Icon,
  HStack,
  Stack,
  Text,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FaEye, FaMoneyBill, FaTrash } from 'react-icons/fa';
import { sendDeleteRequest } from '../lib/request';

export const HoverableImage = ({
  id,
  url,
  views,
  earnings,
}: {
  id: number;
  url: string;
  views: number;
  earnings: number;
}) => {
  const toast = useToast();

  const deleteMedia = async () => {
    const { response, success } = await sendDeleteRequest(`media/${id}`, '');
    if (!success) {
      toast({
        title: 'Media deletion failed',
        description: response?.error || 'An unexpected error occurred',
        duration: 2000,
        isClosable: true,
        status: 'error',
      });
    } else {
      toast({
        title: 'Media deleted',
        duration: 2000,
        isClosable: true,
        status: 'success',
      });
    }
  };

  return (
    <Box role="group" objectFit="cover" filter="auto" fontSize="3xl">
      <Image src={url} _groupHover={{ opacity: 0.3 }} />
      <Box
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        left="0"
        opacity="0"
        transition="opacity 0.5s ease-in-out"
        _groupHover={{ opacity: 1 }}
      >
        <Center
          position="absolute"
          top="0"
          right="0"
          bottom="0"
          left="0"
          color="green"
        >
          <IconButton
            fontSize="3xl"
            position="absolute"
            top="0"
            left="0"
            colorScheme="red"
            variant="ghost"
            as="button"
            icon={<FaTrash />}
            aria-label="Delete"
            onClick={deleteMedia}
            _hover={{ bg: 'transparent' }}
          />
          <Stack>
            <HStack>
              <Icon as={FaEye} w={8} h={8} />
              <Text fontWeight="bold">{views}</Text>
            </HStack>
            <HStack>
              <Icon as={FaMoneyBill} w={8} h={8} />
              <Text fontWeight="bold">{(earnings / 100).toFixed(2)}€</Text>
            </HStack>
          </Stack>
        </Center>
      </Box>
    </Box>
  );
};

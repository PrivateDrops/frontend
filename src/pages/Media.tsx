import { useContext, useEffect, useState } from 'react';
import {
  Image,
  HStack,
  IconButton,
  Text,
  Tooltip,
  VStack,
  Box,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { FooterMenu } from '../components/FooterMenu';
import { Auth } from './Auth';
import { sendGetRequest, sendPostRequest } from '../lib/request';
import { AppContext } from '../context';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { FaLink, FaTrash } from 'react-icons/fa6';

const MediaPage = () => {
  const [media, setMedia] = useState<any[]>([]);
  const { accessToken } = useContext(AppContext);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      const { response, success } = await sendGetRequest('media', accessToken);
      if (!success) return;
      console.log(response.media);
      setMedia(response?.media);
    };

    load();
  }, [accessToken]);

  const copyUrl = (code: string) => {
    navigator.clipboard
      .writeText(`http://localhost:5173/view/${code}`)
      .then(() => {
        toast({
          title: 'Link copied',
          duration: 500,
          status: 'success',
        });
      });
  };

  const deleteMedia = async (id: string) => {
    const { response, success } = await sendPostRequest(
      `media/${id}`,
      {},
      accessToken,
    );
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
      window.location.reload();
    }
  };

  return (
    <Auth>
      <ResponsiveCard>
        <Box overflowX="scroll" padding="4" maxWidth="full">
          {media.map((m: any, index: number) => (
            <Box key={index}>
              <HStack spacing={4} align="stretch" p={4}>
                <Box width="100px" height="100px" overflow="hidden">
                  <Image
                    src={m.url}
                    alt="Dynamic Image"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    borderRadius="md"
                  />
                </Box>
                <VStack spacing={4} align="center" flex="1">
                  <Text fontSize="lg">{m.totalViews} views</Text>
                  <Text fontSize="lg">
                    ${(m.earnings / 100).toFixed(2)} earned
                  </Text>
                </VStack>
                <VStack spacing={4}>
                  <Tooltip label="Copy Link" hasArrow>
                    <IconButton
                      icon={<FaLink />}
                      aria-label="Link"
                      colorScheme="green"
                      onClick={() => copyUrl(m.code)}
                    />
                  </Tooltip>
                  <Tooltip label="Delete" hasArrow>
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Delete"
                      onClick={() => deleteMedia(m.id)}
                    />
                  </Tooltip>
                </VStack>
              </HStack>
              {m == media[media.length - 1] ? '' : <Divider />}
            </Box>
          ))}
        </Box>
      </ResponsiveCard>
      <FooterMenu />
    </Auth>
  );
};

export default MediaPage;

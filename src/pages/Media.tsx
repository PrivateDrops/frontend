import { useContext, useEffect, useState } from 'react';
import {
  HStack,
  IconButton,
  Text,
  Tooltip,
  VStack,
  Box,
  useToast,
  Divider,
} from '@chakra-ui/react';
import ReactTimeAgo from 'react-time-ago';
import { FooterMenu } from '../components/FooterMenu';
import { Auth } from './Auth';
import { sendDeleteRequest, sendGetRequest } from '../lib/request';
import { AppContext } from '../context';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { FaLink, FaTrash } from 'react-icons/fa6';
import { MediaLoader } from '../components/MediaLoader';

const MediaPage = () => {
  const [media, setMedia] = useState<any[]>([]);
  const { accessToken } = useContext(AppContext);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      const { response, success } = await sendGetRequest('media', accessToken);
      if (!success) return;
      setMedia(response);
      console.log(response);
    };

    load();
  }, [accessToken]);

  const copyUrl = (code: string) => {
    navigator.clipboard
      .writeText(`${import.meta.env.VITE_APP_URL}/view/${code}`)
      .then(() => {
        toast({
          title: 'Link copied',
          duration: 500,
          status: 'success',
        });
      });
  };

  const deleteMedia = async (id: string) => {
    const { response, success } = await sendDeleteRequest(
      `media/${id}`,
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
        <Box overflowX="auto" padding="4">
          {media.map((m, index) => (
            <Box key={index}>
              <HStack spacing={4} align="stretch" p={4}>
                <Box width="100px" height="100px" overflow="hidden">
                  <MediaLoader maxW={'100px'} ratio={1} media={m} />
                </Box>
                <VStack spacing={4} align="center" flex="1">
                  <Text fontSize={{ base: 'md', md: 'lg' }}>
                    {m.totalViews} <small>views</small>
                  </Text>
                  <Text fontSize={{ base: 'md', md: 'lg' }}>
                    <ReactTimeAgo date={new Date(m.updatedAt)} locale="en-US" />
                  </Text>
                </VStack>
                <VStack spacing={4}>
                  <Tooltip label="Copy Link" hasArrow>
                    <IconButton
                      icon={<FaLink />}
                      aria-label="Copy Link"
                      colorScheme="green"
                      onClick={() => copyUrl(m.code)}
                    />
                  </Tooltip>
                  <Tooltip label="Delete" hasArrow>
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Delete"
                      colorScheme="red"
                      onClick={() => deleteMedia(m.id)}
                    />
                  </Tooltip>
                </VStack>
              </HStack>
              {index < media.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </ResponsiveCard>
      <FooterMenu />
    </Auth>
  );
};

export default MediaPage;

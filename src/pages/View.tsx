import {
  AspectRatio,
  Badge,
  Box,
  Button,
  CardBody,
  Center,
  CloseButton,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import { sendGetRequest, sendPostRequest } from '../lib/request';
import { valueFormatter } from '../lib/helpers';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { StarRating } from '../components/StarRating';
import { MediaProtectionLayer } from '../components/MediaOverlay';

type Media = {
  id: string;
  code: string;
  price: number;
  currency: string;
  url: string;
  singleView: boolean;
  totalViews: number;
  mime: string;
  viewer: {
    hasPaid: boolean;
    leftFeedback: boolean;
  };
  owner: {
    nickname?: string;
    ratings: number;
  };
};

const ViewPage = () => {
  const [media, setMedia] = useState<Media>();
  const [hide, setHide] = useState<boolean>(false);
  const [expired, setExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const { code } = useParams();
  const [userRating, setUserRating] = useState<number>(
    parseInt(localStorage.getItem('userRating_' + code) || '0'),
  );
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const load = async () => {
      if (!code || code.length < 5) {
        navigate('/');
      } else {
        setLoading(true);
        const { response, success } = await sendGetRequest(`media/${code}`);
        if (success) {
          setMedia({
            id: response.id,
            code: response.code,
            price: response.price / 100,
            currency: response.currency,
            url: response.url,
            singleView: response.singleView,
            totalViews: response.totalViews,
            mime: response.mime,
            viewer: {
              hasPaid: response.viewer.hasPaid,
              leftFeedback: response.viewer.leftFeedback,
            },
            owner: {
              nickname: response.owner.nickname,
              ratings: response.owner.ratings,
            },
          });
          setHide(response.hasPaid);

          if (
            response.singleView &&
            !response.viewer.hasPaid &&
            response.totalViews > 1
          ) {
            setExpired(true);
          }
        } else {
          toast({
            title: 'Media retrieval failed',
            description:
              response?.error ||
              response?.message[0] ||
              'An unexpected error occurred',
            duration: 2000,
            isClosable: true,
            status: 'error',
          });
        }
      }
    };

    load();
  }, [code]);

  const pay = async () => {
    setLoadingButton(true);
    const redirectUrl = `${import.meta.env.VITE_APP_URL}/payment`;
    const { success, response } = await sendPostRequest('payment/checkout', {
      code,
      redirectUrlSuccess: redirectUrl + '?success=true&code=' + code,
      redirectUrlCancel: redirectUrl + '?success=false&code=' + code,
    });
    if (success) window.location.href = response;
    else {
      toast({
        title: 'Payment link retrieval failed',
        description:
          response?.error ||
          response?.message[0] ||
          'An unexpected error occurred',
        duration: 2000,
        isClosable: true,
        status: 'error',
      });
      setLoadingButton(false);
    }
  };

  const leaveFeedback = async (n: number) => {
    setUserRating(n);
    const { success } = await sendPostRequest('media/review', {
      code,
      rating: n,
    });
    if (success) localStorage.setItem('userRating_' + code, String(n));
  };

  const handleFullScreen = (event: React.MouseEvent<HTMLDivElement>) => {
    const element =
      event.currentTarget.parentElement?.querySelector('img, iframe');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element?.requestFullscreen();
    }
  };

  return (
    <Center h="100vh" flexDirection="column" bg="gray.100">
      <Skeleton isLoaded={!loading} borderRadius="md">
        <ResponsiveCard>
          {media && media.url && (
            <>
              <MediaProtectionLayer
                enabled={media.viewer.hasPaid}
                onFullScreenToggle={handleFullScreen}
              >
                <AspectRatio maxW="500px" ratio={1}>
                  {media.mime.includes('image') ? (
                    <Image src={media.url} onLoad={() => setLoading(false)} />
                  ) : (
                    <iframe
                      title="media"
                      src={media.url}
                      onLoad={() => setLoading(false)}
                      allowFullScreen
                      style={{ cursor: 'zoom-in' }}
                    />
                  )}
                </AspectRatio>
              </MediaProtectionLayer>
              {!media.viewer.hasPaid && (
                <CardBody>
                  <Center
                    flexDirection="column"
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="rgba(0,0,0,0.5)"
                  >
                    <>
                      {expired ? (
                        <Text fontSize="5xl" fontWeight="bold" color="white">
                          Expired :/
                        </Text>
                      ) : (
                        <>
                          <Text fontSize="5xl" fontWeight="bold" color="white">
                            {valueFormatter(media.price, media.currency)}
                          </Text>
                          <Button
                            mt={4}
                            colorScheme="green"
                            size="lg"
                            onClick={pay}
                            isDisabled={loadingButton}
                          >
                            {loadingButton ? 'Redirecting...' : 'Pay to reveal'}
                          </Button>
                        </>
                      )}
                    </>
                  </Center>
                </CardBody>
              )}
            </>
          )}
        </ResponsiveCard>
        {media && userRating == 0 && media.viewer.hasPaid && !hide && (
          <VStack position="absolute" top="0" p={4}>
            <Box p={4} bg="white" borderRadius="lg" shadow="md" width="full">
              <HStack>
                <StarRating
                  rating={userRating}
                  setRating={leaveFeedback}
                  count={5}
                  size={24}
                />
                <CloseButton size="sm" onClick={() => setHide(true)} />
              </HStack>
            </Box>
          </VStack>
        )}
        <VStack
          justifyContent="center"
          position="absolute"
          bottom="0"
          left="0"
          p={4}
        >
          <Stack
            p={4}
            borderRadius="xl"
            shadow="lg"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              aria-label="Info"
              icon={<FaInfoCircle size="30px" />}
              onClick={onOpen}
              _hover={{ bg: 'transparent' }}
              color="black"
            />
          </Stack>
        </VStack>
      </Skeleton>

      {media && (
        <Modal isOpen={isOpen} onClose={onClose} size="xs">
          <ModalOverlay
            bg="none"
            backdropFilter="auto"
            backdropInvert="80%"
            backdropBlur="2px"
          />
          <ModalContent mx={4}>
            <ModalHeader>Media Info</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={6}>
              <Box>
                Sent by:&nbsp;
                <Text as="span" fontWeight="bold">
                  {media.owner.nickname || 'Anon'}
                </Text>
              </Box>
              <Box mt={2}>
                Rating:
                {media.owner.ratings == 0 ? (
                  <Badge ml={2} px={2} py={1} borderRadius="md">
                    unrated
                  </Badge>
                ) : (
                  <Badge
                    ml={2}
                    colorScheme={media.owner.ratings >= 3 ? 'green' : 'red'}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {media.owner.ratings}/5
                  </Badge>
                )}
              </Box>
              <Box mt={2}>
                View:&nbsp;
                <Text as="span" fontWeight="bold">
                  {media.singleView ? 'one time' : 'unlimited'}
                </Text>
              </Box>
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              {media.viewer.hasPaid && !media.viewer.leftFeedback && (
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="ghost"
                  onClick={() => {
                    setHide(false);
                    onClose();
                  }}
                >
                  Leave feedback
                </Button>
              )}
              <Button
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Center>
  );
};

export default ViewPage;

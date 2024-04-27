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
import { sendGetRequest, sendPostRequest } from '../lib/request';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { StarRating } from '../components/StarRating';
import { FaInfoCircle } from 'react-icons/fa';

type Media = {
  url: string;
  price: number;
  currency: string;
  singleView: boolean;
  mime: string;
  paid: true;
  ratings: number;
  leftFeedback: boolean;
};

const ViewPage = () => {
  const [media, setMedia] = useState<Media>();
  const [nickname, setNickname] = useState<string>('');
  const [hide, setHide] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { code } = useParams();
  const [userRating, setUserRating] = useState<number>(
    parseInt(localStorage.getItem('userRating_' + code) || '0'),
  );
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const leaveFeedback = async (n: number) => {
    setUserRating(n);
    const { success, response } = await sendPostRequest('media/review', {
      code,
      rating: n,
    });
    if (success) localStorage.setItem('userRating_' + code, String(n));
    else console.error(response);
  };

  useEffect(() => {
    const load = async () => {
      if (!code || code.length < 5) {
        navigate('/');
      } else {
        setLoading(true);
        const { response, success } = await sendGetRequest(`media/${code}`);
        if (success) {
          console.log(response);
          setMedia({
            url: response.mediaUrl,
            price: (response.price / 100),
            currency: response.currency,
            singleView: response.singleView,
            mime: response.mime,
            paid: response.paid,
            ratings: response.ratings,
            leftFeedback: response.leftFeedback,
          });
          setNickname(response.nickname);
        } else {
          toast({
            title: 'Media retrieval failed',
            description: response?.error || 'An unexpected error occurred',
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
    const { success } = await sendGetRequest('media/pay/' + code);
    if (success) window.location.reload();
  };

  return (
    <Center h="100vh" flexDirection="column" bg="gray.100">
      <Skeleton isLoaded={!loading} borderRadius="md">
        <ResponsiveCard>
          {media && media.url && (
            <>
              <AspectRatio maxW="500px" ratio={1}>
                {media.mime.includes('image') ? (
                  <Image src={media.url} onLoad={() => setLoading(false)} />
                ) : (
                  <iframe
                    title="media"
                    src={media.url}
                    onLoad={() => setLoading(false)}
                    allowFullScreen
                  />
                )}
              </AspectRatio>
              {!media.paid && media.price > 0 && (
                <CardBody>
                  <Center
                    flexDirection="column"
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="rgba(0,0,0,0.5)" // Adding an overlay if no image
                  >
                    <Text fontSize="5xl" fontWeight="bold" color="white">
                      ${media.price.toFixed(2)}
                    </Text>
                    <Button mt={4} colorScheme="green" size="lg" onClick={pay}>
                      Pay to reveal
                    </Button>
                  </Center>
                </CardBody>
              )}
            </>
          )}
        </ResponsiveCard>
        {media && userRating == 0 && media.paid && !hide && (
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
                Sent by:{' '}
                <Text as="span" fontWeight="bold">
                  {nickname || 'Anon'}
                </Text>
              </Box>
              <Box mt={2}>
                Rating:
                {media.ratings == 0 ? (
                  <Badge ml={2} px={2} py={1} borderRadius="md">
                    unrated
                  </Badge>
                ) : (
                  <Badge
                    ml={2}
                    colorScheme={media.ratings > 2 ? 'green' : 'red'}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {media.ratings}/5
                  </Badge>
                )}
              </Box>
              <Box mt={2}>
                View:{' '}
                <Text as="span" fontWeight="bold">
                  {media.singleView ? 'one time' : 'unlimited'}
                </Text>
              </Box>
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              {media.paid && !media.leftFeedback && (
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

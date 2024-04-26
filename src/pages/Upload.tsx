import { useContext, useRef, useState } from 'react';
import {
  Box,
  Input,
  Button,
  Text,
  IconButton,
  FormControl,
  CardBody,
  Avatar,
  Icon,
  FormErrorMessage,
  useToast,
  FormLabel,
  useClipboard,
  InputGroup,
  InputRightAddon,
  Spinner,
  useRadioGroup,
  HStack,
} from '@chakra-ui/react';
import { FaPlus, FaCircleXmark, FaCopy } from 'react-icons/fa6';
import { FooterMenu } from '../components/FooterMenu';
import { Auth } from './Auth';
import { sendPostRequestWithFile } from '../lib/request';
import { ResponsiveCard } from '../components/ResponsiveCard';
import { AppContext } from '../context';
import { RadioButton } from '../components/RadioButton';

const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [price, setPrice] = useState<string>('');
  const [isSingleView, setIsSingleView] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(url);
  const { accessToken } = useContext(AppContext);

  const handleOptionChoice = (view: string) => {
    if (view == 'Once') setIsSingleView(true);
    else setIsSingleView(false);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'view',
    defaultValue: 'Unlimited',
    onChange: handleOptionChoice,
  });
  const group = getRootProps();
  const options = ['Once', 'Unlimited'];

  const isValidPrice = (): boolean => {
    if (price == '') return true;
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0.99 && num <= 500.0;
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
        setFileSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (value: string) => {
    const filteredValue = value.replace(/[^0-9.]/g, '');
    if (/^\d*\.?\d{0,2}$/.test(filteredValue)) {
      setPrice(filteredValue);
    }
  };

  const resetForm = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setFileSelected(false);
      setImagePreviewUrl('');
    }

    setStep(1);
    setPrice('');
    setUrl('');
    setIsSingleView(false);
  };

  const upload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({
        title: 'No file selected',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const { response, success } = await sendPostRequestWithFile(
      'media',
      file,
      'mediaFile',
      { price: parseFloat(price) * 100, singleView: isSingleView },
      accessToken,
    );
    if (!success) {
      console.error(response)
      toast({
        title: 'Upload failed',
        description:
          response?.error ||
          response.message[0] ||
          'An unexpected error occurred',
        duration: 2000,
        isClosable: true,
        status: 'error',
      });
      setLoading(false);
      resetForm();
      return;
    }

    setUrl(`http://localhost:5173/view/${response.code}`);
    setStep(3);
    setLoading(false);
    toast({
      title: 'Upload successful',
      description: 'Your file has been uploaded.',
      duration: 2000,
      isClosable: true,
      status: 'success',
    });
  };

  return (
    <Auth>
      <Box textAlign="center">
        <ResponsiveCard>
          <CardBody>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="video/*,image/*"
              onChange={handleFileChange}
            />
            {!fileSelected ? (
              <IconButton
                fontSize="2xl"
                colorScheme="green"
                aria-label="Upload"
                icon={<FaPlus />}
                isRound
                onClick={handleIconClick}
              />
            ) : (
              <Box position="relative" display="inline-block">
                <Avatar size="lg" src={imagePreviewUrl} />
                <Box
                  position="absolute"
                  right="0"
                  bottom="0"
                  transform="translate(30%, 30%)"
                  onClick={resetForm}
                >
                  <Icon as={FaCircleXmark} color="red.500" boxSize="1.25em" />
                </Box>
              </Box>
            )}
            <Text fontSize="xl" mt={4} fontWeight="bold">
              Upload a file
            </Text>
            <Text fontSize="md" color="gray.500">
              of any kind
            </Text>
            {step === 1 && (
              <>
                <FormControl mt={10} isInvalid={!isValidPrice()}>
                  <FormLabel textAlign="center" fontSize="md" color="gray.500">
                    Set Price
                  </FormLabel>
                  <Input
                    variant="unstyled"
                    fontSize="5xl"
                    fontWeight="bold"
                    placeholder={'9.99€'}
                    value={price}
                    textAlign="center"
                    type="number"
                    onChange={(e) => handlePriceChange(e.target.value)}
                    flex={1}
                    textColor={isValidPrice() ? 'gray.500' : 'red.500'}
                  />
                  <FormErrorMessage textAlign="center">
                    Invalid price. Must be between $0.99 and $500.00, up to 2
                    decimal places.
                  </FormErrorMessage>
                </FormControl>
                <Button
                  width="full"
                  mt={8}
                  mb={4}
                  colorScheme="green"
                  size="lg"
                  onClick={() => setStep(2)}
                  isDisabled={
                    loading || price == '' || !isValidPrice() || !fileSelected
                  }
                >
                  Continue
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <FormControl mt={10} isInvalid={!isValidPrice()}>
                  <FormLabel textAlign="center" fontSize="md" color="gray.500">
                    Set view limits
                  </FormLabel>
                  <HStack {...group} justifyContent="center" width="full">
                    {options.map((value: any, index: number) => {
                      const radio = getRadioProps({ value });
                      return (
                        <RadioButton key={index} {...radio}>
                          {value}
                        </RadioButton>
                      );
                    })}
                  </HStack>
                </FormControl>
                <Button
                  width="full"
                  mt={8}
                  mb={4}
                  colorScheme="green"
                  size="lg"
                  isDisabled={loading || price == '' || !isValidPrice()}
                  onClick={upload}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      &nbsp;Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </>
            )}
            {step === 3 && (
              <>
                <FormControl mt={10}>
                  <FormLabel textAlign="center" fontSize="lg" color="gray.500">
                    Here is your shareable link
                  </FormLabel>
                  <InputGroup>
                    <Input value={url} isReadOnly fontWeight="bold" />
                    <InputRightAddon>
                      <IconButton
                        aria-label="Copy URL"
                        icon={<FaCopy />}
                        onClick={onCopy}
                        isDisabled={url === ''}
                        variant="ghost"
                        _hover={{ bg: 'transparent' }}
                      />
                    </InputRightAddon>
                  </InputGroup>
                  {hasCopied ? (
                    <Box color="green.500" mt={2}>
                      Link copied!
                    </Box>
                  ) : null}
                </FormControl>
              </>
            )}
          </CardBody>
        </ResponsiveCard>
      </Box>
      <FooterMenu />
    </Auth>
  );
};

export default UploadPage;

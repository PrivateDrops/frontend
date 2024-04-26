import { Box, useRadio } from '@chakra-ui/react';

export const RadioButton = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="3xl"
        boxShadow="md"
        _checked={{
          bg: 'gray.400',
          color: 'white',
          borderColor: 'gray.400',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};

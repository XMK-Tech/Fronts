import { Flex, Text } from '@chakra-ui/react';

export default function DetailsComponent(props: {
  label: string;
  value?: string | number;
  backgroundColor?: string;
  mb?: string | number;
}) {
  return (
    <Flex mb={props.mb || 8} alignItems={'start'} flexDirection={'column'}>
      <Text fontSize={'medium'} color={'gray.500'}>
        {props.label}
      </Text>
      <Text
        fontSize={'medium'}
        fontWeight={'semibold'}
        color={props.backgroundColor ? 'white' : 'brand.600'}
      >
        {props.value}
      </Text>
    </Flex>
  );
}

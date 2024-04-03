import { Flex, Text } from '@chakra-ui/react';

export default function ContainerStepComponent(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Flex mt={8} flexDirection={'column'}>
      <Text textAlign={'center'} mb={8} fontSize={'large'} color={'gray.500'}>
        {props.title}
      </Text>
      <Flex flexDirection={'column'}>{props.children}</Flex>
    </Flex>
  );
}

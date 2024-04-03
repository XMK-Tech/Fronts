import { Center, Flex, Image, Text } from '@chakra-ui/react';
import welcome from '../../../assets/images/welcome.png';

export default function WelcomeComponent() {
  return (
    <Center padding={20}>
      <Flex alignItems={'center'} flexDirection={'column'}>
        <Text>Welcome</Text>
        <Image src={welcome} width="60%"></Image>
      </Flex>
    </Center>
  );
}

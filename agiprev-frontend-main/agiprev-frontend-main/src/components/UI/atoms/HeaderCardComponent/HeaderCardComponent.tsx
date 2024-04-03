import { Flex, Text } from '@chakra-ui/react';

type HeaderCardComponentProps = {
  title: string;
  headerComponentRigth?: React.ReactNode;
};
export default function HeaderCardComponent(props: HeaderCardComponentProps) {
  return (
    <Flex justifyContent={'space-between'} alignItems={'center'} mb={4}>
      <Text as={'b'} fontSize={'large'}>
        {props.title}
      </Text>
      {props.headerComponentRigth}
    </Flex>
  );
}

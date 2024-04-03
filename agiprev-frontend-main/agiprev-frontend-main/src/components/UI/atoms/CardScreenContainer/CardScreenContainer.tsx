import { Flex } from '@chakra-ui/react';
type CardScreenProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  padding?: number | string;
  margin?: number | string;
  direction?: 'row' | 'column';
};
export function CardScreenContainer(props: CardScreenProps) {
  return (
    <Flex
      flexDirection={props.direction || 'column'}
      margin={props.margin || 4}
      padding={props.padding || 0}
      borderRadius={8}
      backgroundColor={props.backgroundColor || 'white'}
    >
      {props.children}
    </Flex>
  );
}

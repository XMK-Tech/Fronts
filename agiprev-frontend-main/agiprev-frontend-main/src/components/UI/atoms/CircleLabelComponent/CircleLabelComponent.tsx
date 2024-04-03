import { Flex, Icon, Text } from '@chakra-ui/react';
type CircleLabelComponentProps = {
  label: string;
  circleIconColor?: string;
};

const CircleIcon = (props: any) => (
  <Icon {...props} viewBox="0 0 200 200">
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

export default function CircleLabelComponent(props: CircleLabelComponentProps) {
  return (
    <Flex alignItems={'center'}>
      <CircleIcon color={props.circleIconColor || 'brand'} />
      <Text color="gray" marginLeft={4} fontWeight={'medium'} fontSize={'md'}>
        {props.label}
      </Text>
    </Flex>
  );
}

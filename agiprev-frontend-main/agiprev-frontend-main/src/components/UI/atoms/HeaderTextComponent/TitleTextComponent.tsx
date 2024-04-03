import { As, Text } from '@chakra-ui/react';

export type HeaderTextProps = {
  children: React.ReactNode;
  color?: string;
  subTitle?: boolean;
  mb?: string | number;
  mt?: string | number;
  as?: As;
  maxW?: string;
};

export default function TitleTextComponent(props: HeaderTextProps) {
  return (
    <Text
      maxW={props.maxW}
      mt={props.mt}
      mb={props.mb}
      color={props.subTitle ? 'gray.500' : props.color}
      fontSize={props.subTitle ? '16px' : '24px'}
      fontWeight={props.subTitle ? 'light' : 'semibold'}
    >
      {props.children}
    </Text>
  );
}

import { As, Text, TextProps as ChakraTextProps } from '@chakra-ui/react';
import { CSSProperties } from 'react';

export type TextProps = {
  className?: string;
  onClick?: () => {};
  children: React.ReactNode;
  color?: ChakraTextProps['color'];
  style?: CSSProperties;
  fontSize?: ChakraTextProps['fontSize'];
  fontWeight?: ChakraTextProps['fontWeight'];
  lineHeight?: ChakraTextProps['lineHeight'];
  textAlign?: ChakraTextProps['textAlign'];
  as?: As;
  ml?: string | number;
  mr?: string | number;
};

export default function TextComponent(props: TextProps) {
  return (
    <Text
      as={props.as}
      style={props.style}
      onClick={() => props.onClick?.()}
      className={`${props.className}`}
      textAlign={props.textAlign}
      fontSize={props.fontSize}
      fontWeight={props.fontWeight}
      color={props.color}
      ml={props.ml}
      mr={props.mr}
      lineHeight={props.lineHeight}
    >
      {props.children}
    </Text>
  );
}

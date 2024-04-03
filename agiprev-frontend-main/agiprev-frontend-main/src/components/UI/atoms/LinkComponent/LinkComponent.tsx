import {
  Link as ChakraLink,
  TextProps as ChakraTextProps,
} from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

export type TextProps = {
  onClick?: () => {};
  children: React.ReactNode;
  color?: ChakraTextProps['color'];
  style?: CSSProperties;
  fontSize?: ChakraTextProps['fontSize'];
  fontWeight?: ChakraTextProps['fontWeight'];
  to: string;
  m?: string;
};

export default function LinkComponent(props: TextProps) {
  return (
    <ChakraLink
      style={props.style}
      onClick={() => props.onClick?.()}
      fontSize={props.fontSize}
      fontWeight={props.fontWeight}
      color={props.color}
      m={props.m}
      to={props.to}
      as={Link}
    >
      {props.children}
    </ChakraLink>
  );
}

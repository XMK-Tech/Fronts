import {
  Button,
  ButtonProps as ChakraButtonProps,
  ThemeTypings,
} from '@chakra-ui/react';
import { CSSProperties } from 'react';
export type ButtonProps = {
  onSubmit: () => void;
  children?: React.ReactNode;
  width?: string | number | undefined;
  disabled?: boolean;
  className?: string | undefined;
  leftIcon?: React.ReactElement;
  colorScheme?: ThemeTypings['colorSchemes'];
  variant?: ChakraButtonProps['variant'];
  style?: CSSProperties;
  textColor?: ChakraButtonProps['color'];
  margin?: string | number | undefined;
  isLoading?: boolean;
  backgroundColor?: string;
};

export default function ButtonComponent(props: ButtonProps) {
  return (
    <Button
      isLoading={props.isLoading}
      style={props.style}
      colorScheme={props.colorScheme}
      leftIcon={props.leftIcon}
      color={props.textColor}
      variant={props.variant ?? 'solid'}
      disabled={props.disabled}
      width={props.width}
      onClick={() => props.onSubmit()}
      margin={props.margin}
      backgroundColor={props.backgroundColor}
    >
      {props.children}
    </Button>
  );
}

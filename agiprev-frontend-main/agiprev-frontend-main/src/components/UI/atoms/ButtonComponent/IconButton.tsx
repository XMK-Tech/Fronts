import {
  ButtonProps as ChakraButtonProps,
  IconButton,
  ThemeTypings,
  Tooltip,
} from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { useIsWeb } from '../../../../hooks/useIsWeb';
export type ButtonProps = {
  onSubmit: () => void;
  width?: string | number;
  height?: string | number;
  disabled?: boolean;
  className?: string;
  Icon?: React.ReactElement;
  colorScheme?: ThemeTypings['colorSchemes'];
  variant?: ChakraButtonProps['variant'];
  style?: CSSProperties;
  color?: ChakraButtonProps['color'];
  border?: ChakraButtonProps['border'];
  textColor?: ChakraButtonProps['color'];
  marginX?: string | number;
  margin?: string | number;
  isLoading?: boolean;
  arialLabel: string;
  backgroundColor?: ChakraButtonProps['color'];
  p?: string | number;
  toolTipText?: string;
};

export default function IconButtonComponent(props: ButtonProps) {
  const isWeb = useIsWeb();
  const buttonProps = {
    isLoading: props.isLoading,
    style: props.style,
    colorScheme: props.colorScheme,
    icon: props.Icon,
    color: props.color,
    border: props.border,
    textColor: props.textColor,
    variant: props.variant ?? 'solid',
    disabled: props.disabled,
    marginX: props.marginX,
    margin: props.margin,
    width: props.width,
    height: props.height,
    p: props.p,
    backgroundColor: props.backgroundColor,
    'aria-label': props.arialLabel,
    onClick: props.onSubmit,
  };

  return props.toolTipText ? (
    <Tooltip hasArrow label={props.toolTipText}>
      <IconButton size={isWeb ? 'md' : 'xs'} {...buttonProps} />
    </Tooltip>
  ) : (
    <IconButton {...buttonProps} />
  );
}

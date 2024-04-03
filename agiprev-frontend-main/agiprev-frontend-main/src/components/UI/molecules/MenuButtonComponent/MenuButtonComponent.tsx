import {
  Button,
  ButtonProps as ChakraButtonProps,
  ThemeTypings,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { CSSProperties } from 'react';
import { FaChevronDown } from 'react-icons/fa';
export type MenuButtonComponentProps = {
  width?: string | number | undefined;
  disabled?: boolean;
  leftIcon?: React.ReactElement;
  colorScheme?: ThemeTypings['colorSchemes'];
  variant?: ChakraButtonProps['variant'];
  style?: CSSProperties;
  textColor?: ChakraButtonProps['color'];
  m?: string | number | undefined;
  isLoading?: boolean;
  items: {
    icon?: React.ReactElement<any>;
    onClick: () => void;
    label: string;
  }[];
  label: string;
};

export default function MenuButtonComponent(props: MenuButtonComponentProps) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        isLoading={props.isLoading}
        style={props.style}
        colorScheme={props.colorScheme}
        leftIcon={props.leftIcon}
        color={props.textColor}
        variant={props.variant ?? 'solid'}
        disabled={props.disabled}
        width={props.width}
        m={props.m}
      >
        {props.label}
      </MenuButton>
      <MenuList>
        {props.items.map((item, i) => (
          <MenuItem key={i} icon={item.icon} onClick={item.onClick}>
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

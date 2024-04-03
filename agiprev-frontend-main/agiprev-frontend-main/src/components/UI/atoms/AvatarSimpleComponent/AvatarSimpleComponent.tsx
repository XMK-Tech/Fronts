import { Avatar } from '@chakra-ui/react';

type AvatarSimpleComponentProps = {
  label?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | string;
};

export function AvatarSimpleComponent(props: AvatarSimpleComponentProps) {
  return (
    <Avatar
      size={props.size ? props.size : 'sm'}
      color={'white'}
      src={props.src}
      name={props.label}
    />
  );
}

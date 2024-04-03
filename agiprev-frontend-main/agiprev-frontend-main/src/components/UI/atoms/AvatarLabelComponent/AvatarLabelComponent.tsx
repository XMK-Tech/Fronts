import { Stack } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import React from 'react';
import { AvatarSimpleComponent } from '../AvatarSimpleComponent/AvatarSimpleComponent';

export type AvatarLabelComponentProps = {
  label?: string;
  subLabel?: string;
  src?: string;
  marginTop?: number;
  marginBottom?: number;
  textColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | string;
};
export default function AvatarLabelComponent(props: AvatarLabelComponentProps) {
  return (
    <Stack
      mb={props.marginBottom}
      mt={props.marginTop}
      alignItems={'center'}
      direction="row"
    >
      <AvatarSimpleComponent
        size={props.size && props.size}
        src={props.src}
        label={props.label}
      />
      <Stack paddingLeft={2} direction={'column'}>
        <Text
          fontWeight={'600'}
          color={props.textColor && props.textColor}
          fontSize="md"
        >
          {props.label}
        </Text>
        {props.subLabel && (
          <Text
            style={{ marginTop: 0, display: 'flex' }}
            color={props.textColor || 'gray'}
            fontSize={'sm'}
          >
            {props.subLabel}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}

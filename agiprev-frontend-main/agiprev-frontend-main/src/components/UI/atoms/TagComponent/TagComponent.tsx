import { HStack, Tag } from '@chakra-ui/react';
import React from 'react';

type TagProps = {
  size: 'sm' | 'md' | 'lg';
  variante?: 'outline' | 'solid' | 'subtle';
  text: string;
  colorScheme: string;
};
export default function TagComponent(props: TagProps) {
  return (
    <HStack justifyContent={'center'} spacing={4}>
      <Tag
        size={props.size}
        variant={props.variante}
        colorScheme={props.colorScheme}
      >
        {props.text}
      </Tag>
    </HStack>
  );
}

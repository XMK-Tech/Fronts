import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';
type LoadingComponentProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: string;
  speed?: string;
  emptyColor?: string;
  mt?: string | number;
  mb?: string | number;
  minH?: string | number;
};
export default function LoadingComponent(props: LoadingComponentProps) {
  return (
    <Center minH={props.minH} mt={props.mt} mb={props.mb}>
      <Spinner
        thickness={props.thickness || '4px'}
        speed={props.speed || '0.65s'}
        emptyColor={props.emptyColor || 'gray.200'}
        color={props.color || 'blue.500'}
        size={props.size || 'xl'}
      />
    </Center>
  );
}

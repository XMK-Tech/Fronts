import { ToastId, UseToastOptions } from '@chakra-ui/react';

type ToastValidationComponentProps = {
  toast: (options?: UseToastOptions | undefined) => ToastId;
  status: 'success' | 'error' | 'warning' | 'info' | 'loading' | undefined;
  title?: string;
  description?: string;
  duration?: number;
};

export function showToast(props: ToastValidationComponentProps) {
  props.toast({
    position: 'top-right',
    title: props.title,
    description: props.description,
    status: props.status,
    duration: props.duration || 3000,
    isClosable: true,
  });
}

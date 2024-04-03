import { useMediaQuery } from '@chakra-ui/react';

export function useIsWeb(): boolean {
  // If screen is larger than 768px, we consider it a mobile screen
  // is web and a variable to know if the version is web
  const [isWeb] = useMediaQuery('(min-width: 768px)');
  return isWeb;
}

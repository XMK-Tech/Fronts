import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

export const brand = {
  50: '#FFF5F5',
  100: '#FED7D7',
  200: '#FEB2B2',
  300: '#FC8181',
  400: '#F56565',
  500: '#E01B1B',
  600: '#C53030',
  700: '#9B2C2C',
  800: '#822727',
  900: '#63171B',
  transparentWhite: '#F4F4F4AA',
};

//TODO: Change colors
const theme = extendTheme(
  {
    colors: {
      brand,
    },
  },
  withDefaultColorScheme({
    colorScheme: 'brand',
  })
);

export default theme;

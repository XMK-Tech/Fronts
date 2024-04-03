import { Box, Flex, Text } from '@chakra-ui/react';

export function Historymessage(item: { message: string }) {
  return (
    <Flex alignItems={'center'} my={4}>
      <Line />
      <Box>
        <Text color={'gray'} fontSize={'14px'} fontWeight={'700'} as="a">
          {item.message}
        </Text>
      </Box>
      <Line />
    </Flex>
  );
}

function Line() {
  return (
    <Box fontWeight={'900'} mx={4} flexGrow={1}>
      <hr />
    </Box>
  );
}

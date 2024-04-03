import { Stack } from '@chakra-ui/react';
import { formatHour } from '../../../../utils/functions/formatDate';
import TextComponent from '../../atoms/TextComponent/TextComponent';

export function MessageComponent(item: {
  person: string;
  message: string;
  time: string;
  fromRequester: boolean;
}) {
  return (
    <Stack
      style={{ alignItems: item.fromRequester ? 'flex-end' : 'flex-start' }}
      mx={4}
      my={4}
    >
      <TextComponent fontSize={'14px'} color={'brand.500'} fontWeight={'700'}>
        {item.person}
      </TextComponent>
      <TextComponent style={{ marginTop: 0 }} fontSize={'14px'}>
        {item.message}
      </TextComponent>
      <TextComponent style={{ marginTop: 0 }} fontSize={'12px'} color={'gray'}>
        {formatHour(item.time)}
      </TextComponent>
    </Stack>
  );
}

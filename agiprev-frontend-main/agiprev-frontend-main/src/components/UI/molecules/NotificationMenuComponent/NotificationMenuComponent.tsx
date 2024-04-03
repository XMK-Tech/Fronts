import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
} from '@chakra-ui/react';
import { FaRegBell } from 'react-icons/fa';
import TextComponent from '../../atoms/TextComponent/TextComponent';

export type NotificationMenuProps = {
  items?: {
    person: string;
    subject: string;
    time: string;
    action: () => void;
  }[];
};

export default function NotificationMenuComponent(
  props: NotificationMenuProps
) {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<FaRegBell />}
        variant="guost"
      />
      <MenuList w={'400px'} p={'10px'} maxH={'500px'} overflow={'auto'}>
        <Box p={'6px 12px'}>
          <TextComponent fontSize={'20px'} fontWeight={'700'}>
            Notificações
          </TextComponent>
        </Box>
        {props.items?.map((item, i) => (
          <MenuItem key={i} mt={'10px'} onClick={item.action}>
            <Stack>
              <TextComponent
                fontSize={'14px'}
                color={'brand.500'}
                fontWeight={'700'}
              >
                {item.person}
              </TextComponent>
              <TextComponent fontSize={'14px'}>{item.subject}</TextComponent>
              <TextComponent fontSize={'12px'} color={'brand.500'}>
                {item.time}
              </TextComponent>
            </Stack>
          </MenuItem>
        )) ?? (
          <TextComponent textAlign={'center'}>
            Não há notificações
          </TextComponent>
        )}
      </MenuList>
    </Menu>
  );
}

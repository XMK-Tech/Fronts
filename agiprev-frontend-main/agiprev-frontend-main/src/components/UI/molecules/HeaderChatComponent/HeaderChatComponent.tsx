import { Flex } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { FaEye } from 'react-icons/fa';
import AvatarLabelComponent from '../../atoms/AvatarLabelComponent/AvatarLabelComponent';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';

type HeaderChatComponentProps = {
  style?: CSSProperties;
  onSubmit: () => void;
  name?: string;
};

export function HeaderChatComponent(props: HeaderChatComponentProps) {
  return (
    <Flex
      background={'brand.500'}
      borderRadius={8}
      justifyContent={'space-between'}
      padding={3}
      width={'100%'}
      style={props.style}
      alignItems={'center'}
    >
      <AvatarLabelComponent
        textColor="white"
        label={props.name}
        subLabel="Usuário"
        size={'md'}
      ></AvatarLabelComponent>
      <ButtonComponent
        colorScheme={'whiteAlpha'}
        backgroundColor="#fff"
        textColor={'#3182CE'}
        onSubmit={() => props.onSubmit()}
        leftIcon={<FaEye />}
      >
        Observadores
      </ButtonComponent>
    </Flex>
  );
}

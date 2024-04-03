import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import ModalStructureComponent from '../ModalStructureComponent/ModalStructureComponent';
import { Flex } from '@chakra-ui/react';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { FaExclamationCircle } from 'react-icons/fa';

export function DeleteModalComponent(props: {
  showModal: boolean;
  title: string;
  subTitle: string;
  setShowModal: () => void;
  onSubmit?: () => void;
}) {
  return (
    <ModalStructureComponent
      isOpen={props.showModal}
      onClose={() => props.setShowModal()}
      title={`Excluir`}
      size="lg"
    >
      <Flex
        mb={5}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <FaExclamationCircle size={50} color="#E53E3E" />
        <TextComponent fontWeight={'bold'} fontSize={'18px'}>
          {props.title}
        </TextComponent>
        <TextComponent fontWeight={'light'} fontSize={'14px'}>
          {props.subTitle}
        </TextComponent>
      </Flex>
      <Flex mb={5} justifyContent={'space-between'}>
        <ButtonComponent
          variant={'outline'}
          onSubmit={() => {
            props.setShowModal();
          }}
        >
          Cancelar
        </ButtonComponent>
        <ButtonComponent
          onSubmit={() => {
            props.onSubmit?.();
          }}
        >
          Excluir
        </ButtonComponent>
      </Flex>
    </ModalStructureComponent>
  );
}

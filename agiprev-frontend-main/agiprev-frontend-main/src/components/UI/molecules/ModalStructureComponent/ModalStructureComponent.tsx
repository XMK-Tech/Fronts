import {
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';
import React from 'react';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';

export type ModalStructureComponentProps = {
  children: React.ReactNode;
  size: string;
  maxW?: string;
  isCentered?: boolean;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  description?: string;
  isLoadingTitle?: boolean;
};

export default function ModalStructureComponent(
  props: ModalStructureComponentProps
) {
  return (
    <Modal
      size={props.size}
      isOpen={props.isOpen}
      onClose={props.onClose}
      isCentered={props.isCentered}
    >
      <ModalOverlay />
      <ModalContent maxW={props.maxW}>
        <ModalHeader pb={'5px'} m={'0 0 10px 0'}>
          <Flex alignItems={'center'}>
            <TextComponent fontWeight={'500'} color={'black'} fontSize={'22px'}>
              {props.title}
            </TextComponent>
            {props.isLoadingTitle && (
              <Spinner marginLeft={4} size={'sm'} color="brand.500" />
            )}
          </Flex>

          <TitleTextComponent mt={4} subTitle>
            {props.description}
          </TitleTextComponent>
          <Divider />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8} pt={'0'}>
          {props.children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

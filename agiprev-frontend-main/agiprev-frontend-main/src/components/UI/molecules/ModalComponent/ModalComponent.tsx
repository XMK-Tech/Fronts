import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { FaCheck, FaExclamation, FaInfo } from 'react-icons/fa';
import TextComponent from '../../atoms/TextComponent/TextComponent';

export type ModalComponentProps = {
  title: string;
  body: React.ReactNode;
  isOpen: boolean;
  onClose: () => null;
  onClick: () => null;
  notificationType: 'success' | 'error' | 'info';
  type?: 'normal' | 'big';
};

const Icon = ({
  children,
  bgColor,
  m,
  w,
}: {
  children: React.ReactNode;
  bgColor: string;
  m: string;
  w: string;
}) => {
  return (
    <Box
      bgColor={bgColor}
      rounded={'200px'}
      h={'45px'}
      w={w}
      p={'13px 0 0 13px'}
      m={m}
    >
      {children}
    </Box>
  );
};
const IconSuccess = ({ m, w }: { m: string; w: string }) => {
  return (
    <Icon bgColor={'#C6F6D5'} m={m} w={w}>
      <FaCheck color="#38A169" size={'20px'} />
    </Icon>
  );
};
const IconError = ({ m, w }: { m: string; w: string }) => {
  return (
    <Icon bgColor={'#FED7D7'} m={m} w={w}>
      <FaExclamation color="#E53E3E" size={'20px'} />
    </Icon>
  );
};
const IconInfo = ({ m, w }: { m: string; w: string }) => {
  return (
    <Icon bgColor={'#BEE3F8'} m={m} w={w}>
      <FaInfo color="#3059BA" size={'20px'} />
    </Icon>
  );
};

function ModalNormalComponent({
  notificationType,
  title,
  body,
  onClose,
  onClick,
  m,
}: {
  notificationType: string;
  title: string;
  body: React.ReactNode;
  onClose: () => null;
  onClick: () => null;
  m: string;
}) {
  return (
    <Flex>
      {notificationType === 'success' && <IconSuccess m={m} w={'60px'} />}
      {notificationType === 'error' && <IconError m={m} w={'60px'} />}
      {notificationType === 'info' && <IconInfo m={m} w={'60px'} />}
      <Box>
        <ModalHeader pb={'5px'}>
          <TextComponent fontWeight={'500'} color={'#171923'} fontSize={'22px'}>
            {title}
          </TextComponent>
        </ModalHeader>
        <ModalBody pt={'0'}>
          <TextComponent fontWeight={'400'} color={'#718096'} fontSize={'16px'}>
            {body}
          </TextComponent>
        </ModalBody>
        <ModalFooter>
          <Button
            variant={'outline'}
            colorScheme={'black'}
            mr={3}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button colorScheme={'brand'} onClick={onClick}>
            Continuar
          </Button>
        </ModalFooter>
      </Box>
    </Flex>
  );
}

function ModalBigComponent({
  notificationType,
  title,
  body,
  onClose,
  onClick,
  m,
}: {
  notificationType: string;
  title: string;
  body: React.ReactNode;
  onClose: () => null;
  onClick: () => null;
  m: string;
}) {
  return (
    <Flex
      direction={'column'}
      verticalAlign={'bottom'}
      justifyContent={'center'}
    >
      {notificationType === 'success' && <IconSuccess m={m} w={'45px'} />}
      {notificationType === 'error' && <IconError m={m} w={'45px'} />}
      {notificationType === 'info' && <IconInfo m={m} w={'45px'} />}
      <ModalHeader pb={'5px'} textAlign={'center'}>
        <TextComponent fontWeight={'500'} color={'#171923'} fontSize={'22px'}>
          {title}
        </TextComponent>
      </ModalHeader>
      <ModalBody pt={'0'} textAlign={'center'}>
        <TextComponent fontWeight={'400'} color={'#718096'} fontSize={'16px'}>
          {body}
        </TextComponent>
      </ModalBody>
      <ModalFooter>
        <Flex justify={'space-between'} w={'100%'}>
          <Button
            variant={'outline'}
            colorScheme={'black'}
            w={'48%'}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button colorScheme={'brand'} w={'48%'} onClick={onClick}>
            Continuar
          </Button>
        </Flex>
      </ModalFooter>
    </Flex>
  );
}

export default function ModalComponent(props: ModalComponentProps) {
  return (
    <Modal
      isCentered={true}
      size={'xl'}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        {props.type === 'big' ? (
          <ModalBigComponent
            notificationType={props.notificationType}
            title={props.title}
            body={props.body}
            onClose={props.onClose}
            m={'10px auto'}
            onClick={props.onClick}
          />
        ) : (
          <ModalNormalComponent
            notificationType={props.notificationType}
            title={props.title}
            body={props.body}
            onClose={props.onClose}
            m={'20px 0 0 20px'}
            onClick={props.onClick}
          />
        )}
      </ModalContent>
    </Modal>
  );
}

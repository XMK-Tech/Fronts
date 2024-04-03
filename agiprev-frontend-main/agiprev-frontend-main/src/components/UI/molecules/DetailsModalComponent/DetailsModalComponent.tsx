import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import ImageComponent from '../../atoms/ImageComponent/ImageComponent';
import LinkComponent from '../../atoms/LinkComponent/LinkComponent';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import ModalStructureComponent from '../ModalStructureComponent/ModalStructureComponent';

export type DetailsModalComponentProps = {
  title: string;
  data: { item: string; description?: string }[];
  imgUrl?: string;
  infoCard?: React.ReactNode;
  isOpen: boolean;
  editLink?: string;
  onClose: () => void;
};

export default function DetailsModalComponent(
  props: DetailsModalComponentProps
) {
  return (
    <ModalStructureComponent
      title={props.title}
      size={'sm'}
      isOpen={props.isOpen}
      onClose={props.onClose}
      isCentered={true}
      maxW={props.infoCard ? '1200px' : '400px'}
    >
      <Flex>
        <Box
          position={'relative'}
          w={'400px'}
          pb={'70px !important'}
          boxShadow={'0 0.1rem 1rem 0.25rem rgba(0, 0, 0, 0.1)'}
          rounded={'10px'}
          p={'10px 10px'}
          borderWidth="1px"
        >
          <ImageComponent src={props.imgUrl || ''} className="h-80px" />
          {props.data.map((info, index) => (
            <Flex key={index} m={'0 0 15px 0'}>
              <TextComponent color={'black'} fontWeight={'700'}>
                {info.item}:
              </TextComponent>
              <TextComponent color={'brand.800'}>
                &ensp; {info.description}
              </TextComponent>
            </Flex>
          ))}
          <Flex
            justifyContent={'space-around'}
            w={'100%'}
            position={'absolute'}
            bottom={0}
            left={0}
          >
            <LinkComponent to={props.editLink || ''}>
              <ButtonComponent onSubmit={() => {}} margin={'auto 0 10px 0'}>
                Editar
              </ButtonComponent>
            </LinkComponent>
          </Flex>
        </Box>
        {props.infoCard && (
          <Box
            m={'0 0 0 10px'}
            w={'800px'}
            boxShadow={'0 0.1rem 1rem 0.25rem rgba(0, 0, 0, 0.1)'}
            rounded={'10px'}
            p={'10px 10px'}
            borderWidth="1px"
          >
            {props.infoCard}
          </Box>
        )}
      </Flex>
    </ModalStructureComponent>
  );
}

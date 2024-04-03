import AvatarLabelComponent from '../../atoms/AvatarLabelComponent/AvatarLabelComponent';
import React, { ChangeEventHandler } from 'react';
import ModalStructureComponent from '../../molecules/ModalStructureComponent/ModalStructureComponent';
import { PaginationComponent } from '../../molecules/PaginationComponent/PaginationComponent';
import SearchSelectComponent from '../../molecules/SearchSelectComponent/SearchSelectComponent';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import noPerson from '../../../../assets/images/noPerson.png';
import ImageComponent from '../../atoms/ImageComponent/ImageComponent';

type PersonModalComponentProps = {
  title: string;
  onClose: () => void;
  isOpen: boolean;
  infoCard?: React.ReactNode;
  items: {
    name: string;
    onSubmit?: () => void;
  }[];
  onSelectedPageChanged?: (page: number) => void;
  selectedPage?: number;
  arrayLength?: number;
  maxPageItens?: number;
  onChangeText?: ChangeEventHandler<HTMLInputElement>;
  inputValue?: string;
  onChangeSelect?: ChangeEventHandler<HTMLSelectElement>;
  onClean?: () => void;
  options?: { id: string; name: string }[];
  isLoading?: boolean;
};

export function PersonModalComponent(props: PersonModalComponentProps) {
  function modalContent() {
    if (props.items.length > 0) {
      return props.items.map((e, i) =>
        e.onSubmit ? (
          <ButtonComponent
            key={i}
            width={'100%'}
            style={{ justifyContent: 'flex-start', marginTop: 18 }}
            variant="outlined"
            onSubmit={e.onSubmit ? e.onSubmit : () => {}}
          >
            <AvatarLabelComponent
              marginTop={3}
              textColor="black"
              label={e.name}
              size={'md'}
            ></AvatarLabelComponent>
          </ButtonComponent>
        ) : (
          <AvatarLabelComponent
            key={i}
            marginTop={3}
            textColor="black"
            label={e.name}
            size={'md'}
          ></AvatarLabelComponent>
        )
      );
    } else {
      return (
        <Flex
          marginY={15}
          padding={4}
          backgroundColor={'white'}
          borderRadius={8}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <ImageComponent width="50%" src={noPerson} />
          <Text fontSize={'16px'} fontWeight={'700'} as="a">
            Pessoas não encontradas
          </Text>
        </Flex>
      );
    }
  }
  return (
    <>
      <ModalStructureComponent
        title={props.title}
        size={'sm'}
        isOpen={props.isOpen}
        onClose={props.onClose}
        isCentered={true}
        maxW={props.infoCard ? '1200px' : '400px'}
      >
        {props.isLoading ? (
          <Flex
            justifyContent={props.isLoading ? 'center' : undefined}
            alignItems={props.isLoading ? 'center' : undefined}
          >
            <Spinner size={'xl'} color="brand.500"></Spinner>
          </Flex>
        ) : (
          <>
            {props.options && (
              <SearchSelectComponent
                onChangeText={props.onChangeText}
                inputValue={props.inputValue}
                onClean={props.onClean ?? (() => {})}
                onChangeSelect={props.onChangeSelect}
                options={props.options}
              />
            )}
            {modalContent()}
            {props.arrayLength && (
              <PaginationComponent
                onSelectedPageChanged={
                  props.onSelectedPageChanged ?? (() => {})
                }
                selectedPage={props.selectedPage ?? 0}
                arrayLength={props.arrayLength ?? 0}
                maxPageItens={props.maxPageItens ?? 0}
              ></PaginationComponent>
            )}
          </>
        )}
      </ModalStructureComponent>
    </>
  );
}

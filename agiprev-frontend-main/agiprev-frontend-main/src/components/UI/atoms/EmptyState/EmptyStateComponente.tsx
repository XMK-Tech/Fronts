import React from 'react';
import { Flex } from '@chakra-ui/react';
import EmptyImage from '../../../../assets/empty.png';
import ImageComponent from '../ImageComponent/ImageComponent';
import TitleTextComponent from '../HeaderTextComponent/TitleTextComponent';

export default function EmptyStateComponent() {
  return (
    <Flex flexDirection={'column'} alignItems={'center'}>
      <Flex mt={8}>
        <TitleTextComponent
          subTitle
          children={'Não foram encontrados resultados'}
        />
      </Flex>
      <ImageComponent width="60%" src={EmptyImage} />
    </Flex>
  );
}

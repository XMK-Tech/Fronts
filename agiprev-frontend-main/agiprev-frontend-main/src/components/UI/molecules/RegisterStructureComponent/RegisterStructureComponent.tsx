import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import LinkComponent from '../../atoms/LinkComponent/LinkComponent';
import ImageComponent from '../../atoms/ImageComponent/ImageComponent';
import RegisterImage from '../../../../assets/registerImage.png';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { useIsWeb } from '../../../../hooks/useIsWeb';

type RegisterStructureComponentProps = {
  title: string;
  subTitle: string;
  content: React.ReactNode;
  buttonTitle: string;
  onSubmit: () => void;
  goBack?: string;
  centeredContent?: boolean;
  onSubmitGoBack?: () => void;
  disabledButton?: boolean;
};

export default function RegisterStructureComponent(
  props: RegisterStructureComponentProps
) {
  const navigate = useNavigate();
  const isWeb = useIsWeb();

  return (
    <Flex>
      <Flex w={isWeb ? '80%' : '100%'} height="100vh">
        <Flex
          w={'100%'}
          justifyContent="space-between"
          flexDirection={'column'}
        >
          <Flex mt={2} flexDirection={'column'}>
            <TitleTextComponent>{props.title}</TitleTextComponent>
            <TitleTextComponent mb={4} subTitle>
              {props.subTitle}
            </TitleTextComponent>
          </Flex>
          <Flex
            justifyContent={props.centeredContent ? 'center' : ''}
            h={'100vh'}
            overflowY={'auto'}
            mb={4}
          >
            {props.content}
          </Flex>
          <Flex justifyContent={'end'}>
            {props.goBack && (
              <ButtonComponent
                variant={'outline'}
                margin={'0 10px 0 0'}
                onSubmit={() => {
                  navigate(`/${props.goBack}`);
                  props.onSubmitGoBack && props.onSubmitGoBack();
                }}
              >
                Sair
              </ButtonComponent>
            )}
            <ButtonComponent
              disabled={props.disabledButton}
              margin={'0 10px 0 0'}
              onSubmit={props.onSubmit}
            >
              {props.buttonTitle}
            </ButtonComponent>
          </Flex>
        </Flex>
      </Flex>
      {isWeb && (
        <Flex w={'20%'} height="100vh">
          <Flex
            direction={'column'}
            justifyContent={'space-between'}
            height="100%"
            backgroundColor={'brand.500'}
            padding={5}
          >
            <Box>
              <TitleTextComponent color="white">
                Estamos Quase lá
              </TitleTextComponent>
            </Box>
            <Box>
              <ImageComponent src={RegisterImage} />
            </Box>
            <TextComponent color={'white'}>
              Precisa de ajuda?{' '}
              <LinkComponent to="/login">Contato com suporte</LinkComponent>
            </TextComponent>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

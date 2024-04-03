import { CSSProperties } from 'react';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { Flex } from '@chakra-ui/react';
import ImageComponent from '../../atoms/ImageComponent/ImageComponent';
import Agiprev from '../../../../assets/images/agiprev.png';
import { useIsWeb } from '../../../../hooks/useIsWeb';

export type LoginStructureProps = {
  children: React.ReactNode;
  subtitle: string;
  style?: CSSProperties;
};

export default function LoginStructureComponent(props: LoginStructureProps) {
  const isWeb = useIsWeb();
  return (
    <Flex justifyContent={'center'} alignItems={'center'}>
      {isWeb && (
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          h={'100vh'}
          w={'50%'}
          backgroundColor={'brand.500'}
        >
          <ImageComponent height="100%" width="50%" src={Agiprev} />
        </Flex>
      )}

      <Flex
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        h={'100vh'}
        w={'50%'}
      >
        <Flex flexDirection={'column'} w={'315px'}>
          <TextComponent
            fontSize={'26px'}
            fontWeight={500}
            style={{ marginBottom: 8, textAlign: 'center' }}
          >
            AGIPREV-PASEP
          </TextComponent>
          <TextComponent
            fontSize={'14px'}
            fontWeight={400}
            style={{
              marginBottom: 40,
              letterSpacing: '3%',
              textAlign: 'center',
            }}
          >
            {props.subtitle}
          </TextComponent>
        </Flex>
        <Flex w={'315px'} alignItems={'center'} flexDirection={'column'}>
          {props.children}
        </Flex>
      </Flex>
    </Flex>
  );
}

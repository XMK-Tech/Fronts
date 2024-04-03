import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import ImageComponent from '../../atoms/ImageComponent/ImageComponent';
import { Box } from '@chakra-ui/react';

export type LoginButtonComponentProps = {
  onSubmit: () => void;
  iconBoxW: string;
  iconPl?: string;
  iconSrc: string;
  text: string;
};

export default function LoginButtonComponent(props: LoginButtonComponentProps) {
  return (
    <ButtonComponent
      variant="outline"
      onSubmit={props.onSubmit}
      colorScheme={'blackAlpha'}
      width={275}
    >
      <Box w={props.iconBoxW} pl={props.iconPl}>
        <ImageComponent width={'24px'} height={'24px'} src={props.iconSrc} />
      </Box>
      <Box>
        <TextComponent color={'black'}>{props.text}</TextComponent>
      </Box>
    </ButtonComponent>
  );
}

import { Box } from '@chakra-ui/react';
import TextComponent from '../TextComponent/TextComponent';

type DataBoxComponentProps = {
  title: string;
  info: string;
};
export default function DataBoxComponent(props: DataBoxComponentProps) {
  return (
    <Box>
      <TextComponent fontSize={'18px'} color={'brand.500'} fontWeight={'400'}>
        {props.title}
      </TextComponent>
      <TextComponent fontSize={'36px'} color={'brand.500'} fontWeight={'700'}>
        {props.info}
      </TextComponent>
    </Box>
  );
}

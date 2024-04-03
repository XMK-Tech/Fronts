import { Center } from '@chakra-ui/react';
import { CardScreenContainer } from '../../components/UI/atoms/CardScreenContainer/CardScreenContainer';

export default {
  title: 'Atoms/CardScreenContainer',
  component: CardScreenContainer,
};

export const AvatarLabel = () => (
  <CardScreenContainer>
    <Center>ScreenContainer</Center>
  </CardScreenContainer>
);

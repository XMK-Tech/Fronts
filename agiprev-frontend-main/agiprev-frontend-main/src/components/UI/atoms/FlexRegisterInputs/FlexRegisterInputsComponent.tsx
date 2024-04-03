import { Flex } from '@chakra-ui/layout';
import { useIsWeb } from '../../../../hooks/useIsWeb';

export default function FlexRegisterInputsComponent(props: {
  children: React.ReactNode;
  justifyContent?: string;
}) {
  const isWeb = useIsWeb();
  return (
    <Flex
      mb={4}
      flexDirection={isWeb ? 'row' : 'column'}
      justifyContent={props.justifyContent ?? 'space-between'}
    >
      {props.children}
    </Flex>
  );
}

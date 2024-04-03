import { Flex, Stack, Text } from '@chakra-ui/react';
import { FaFileAlt } from 'react-icons/fa';
import addNotes from '../../../../assets/images/addNotes.png';
import ImageComponent from '../../atoms/ImageComponent/ImageComponent';

type DocumentComponentProps = {
  documentType: string;
  DocumentName: string;
};

export function DocumentComponent(props: DocumentComponentProps) {
  return (
    <Stack
      borderBottom={'1px'}
      borderColor={'white'}
      direction={'row'}
      alignItems="center"
      justifyContent={'space-between'}
      paddingBottom={1}
      marginTop={3}
    >
      <Stack direction={'row'}>
        <FaFileAlt size={23} color="white" />
        <Text paddingLeft={2} color={'white'} fontSize={'14px'}>
          {props.DocumentName}
        </Text>
      </Stack>
      <Text
        color={'white'}
        fontSize={'18px'}
        paddingRight={5}
        fontWeight={'700'}
        as="a"
      >
        {props.documentType}
      </Text>
    </Stack>
  );
}

export function EmptyStateDocumentComponent() {
  return (
    <Flex
      marginY={15}
      padding={4}
      backgroundColor={'white'}
      borderRadius={8}
      flexDirection={'column'}
      alignItems={'center'}
    >
      <ImageComponent width="50%" src={addNotes} />
      <Text fontSize={'18px'} fontWeight={'700'} as="a">
        Documentos são exibidos aqui
      </Text>
    </Flex>
  );
}

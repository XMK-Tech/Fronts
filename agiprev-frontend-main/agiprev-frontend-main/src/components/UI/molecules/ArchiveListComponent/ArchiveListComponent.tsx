import { Flex, Text, Image, Center } from '@chakra-ui/react';
import DetailsComponent from '../../atoms/DetailsComponent/DetailsComponet';
import IconButtonComponent from '../../atoms/ButtonComponent/IconButton';
import { FaWindowClose } from 'react-icons/fa';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { AttachmentType } from '../../organisms/uploadModel/UploadApi';
import { Dispatch, SetStateAction } from 'react';
import { formatDateAndHour } from '../../../../utils/functions/formatDate';

type ArquiveListProps = {
  attachments: AttachmentType[];
  setAttachments: Dispatch<SetStateAction<AttachmentType[]>>;
};
export default function ArchiveListComponent(props: ArquiveListProps) {
  return (
    <Flex flexDirection={'column'} mb={20}>
      <Center>
        <TextComponent fontWeight={'bold'}>Arquivos Adicionados</TextComponent>
      </Center>
      {props.attachments.map((attachment, i) => (
        <Flex
          key={i}
          borderRadius={8}
          w={'100%'}
          flexDirection={'column'}
          padding={2}
          bg={'#F6F6F6'}
          my={2}
        >
          <Flex mb={3} justifyContent={'space-between'}>
            <Text fontSize={'sm'} fontWeight={'semibold'} color={'brand.500'}>
              {attachment.id}
            </Text>
            <Text fontSize={'sm'} fontWeight={'semibold'} color={'brand.500'}>
              {formatDateAndHour(new Date(), true)}
            </Text>
          </Flex>
          <Flex justifyContent={'space-between'}>
            <Flex>
              <Flex>
                <Image
                  boxSize="40px"
                  objectFit="cover"
                  src={require('../../../../assets/images/archive.png')}
                  borderRadius={8}
                />
              </Flex>
              <Flex alignItems={'center'} ml={4}>
                <DetailsComponent
                  mb={'0px'}
                  label={attachment.type || ''}
                  value={attachment.displayName}
                />
              </Flex>
            </Flex>
            <Flex alignItems={'center'}>
              <IconButtonComponent
                toolTipText="Remover"
                arialLabel="Remover"
                Icon={<FaWindowClose />}
                onSubmit={() => {
                  props.setAttachments(
                    props.attachments.filter(
                      (item) => item.id !== attachment.id
                    )
                  );
                }}
                colorScheme="red"
              />
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}

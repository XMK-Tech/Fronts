import { Flex, Text, Image } from '@chakra-ui/react';
import DetailsComponent from '../../atoms/DetailsComponent/DetailsComponet';
import IconButtonComponent from '../../atoms/ButtonComponent/IconButton';
import { FaDownload } from 'react-icons/fa';

type ArquiveDetailsProps = {
  title: string;
  subTitle: string;
  typeArchive?: string;
  archive?: string;
  linkDowload?: boolean | false;
};
export default function ArchiveDetailsComponent(props: ArquiveDetailsProps) {
  return (
    <Flex
      borderRadius={8}
      w={'100%'}
      flexDirection={'column'}
      padding={2}
      bg={'#F6F6F6'}
      my={2}
    >
      <Flex mb={3} justifyContent={'space-between'}>
        <Text fontSize={'sm'} fontWeight={'semibold'} color={'brand.500'}>
          {props.title}
        </Text>
        <Text fontSize={'sm'} fontWeight={'semibold'} color={'brand.500'}>
          {props.subTitle}
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
              label={props.typeArchive || ''}
              value={props.archive}
            />
          </Flex>
        </Flex>

        <Flex alignItems={'center'}>
          {props.linkDowload && (
            <IconButtonComponent
              toolTipText="Baixar arquivo"
              arialLabel="Baixar arquivo"
              Icon={<FaDownload />}
              onSubmit={() => {}}
              backgroundColor={'green.500'}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

import { Flex, Stack } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import Dropzone from 'react-dropzone';
import { FaPaperclip, FaWindowClose } from 'react-icons/fa';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import IconButtonComponent from '../../atoms/ButtonComponent/IconButton';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { uploadFiles } from '../../organisms/uploadModel/UploadApi';

export type DropZoneLIstComponentProps = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  fileIds: string[];
  setFileIds: Dispatch<SetStateAction<string[]>>;
};

export default function DropZoneLIstComponent(
  props: DropZoneLIstComponentProps
) {
  return (
    <Flex width={'400px'} direction={'column'}>
      <Dropzone
        onDrop={async (acceptedFiles) => {
          props.setFiles([...props.files, ...acceptedFiles]);
          const responses = await uploadFiles(acceptedFiles);
          props.setFileIds([
            ...props.fileIds,
            ...responses.map((item) => item.id),
          ]);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <Stack {...getRootProps()}>
            <ButtonComponent
              {...getInputProps()}
              style={{ borderRadius: 29 }}
              width={'300px'}
              margin={'0 0 0 10px'}
              onSubmit={() => {}}
              leftIcon={<FaPaperclip />}
            >
              Anexar Arquivos
            </ButtonComponent>
          </Stack>
        )}
      </Dropzone>
      {props.files.map((file, i) => (
        <Flex key={i} align={'center'}>
          <IconButtonComponent
            Icon={<FaWindowClose />}
            variant={'ghost'}
            width={'40px'}
            p={0}
            height={'20px'}
            onSubmit={() => {
              props.setFiles(props.files.filter((item, index) => index !== i));
              props.setFileIds(
                props.fileIds.filter((item, index) => index !== i)
              );
            }}
            arialLabel={'Remover'}
          />
          <TextComponent>{file.name}</TextComponent>
        </Flex>
      ))}
    </Flex>
  );
}

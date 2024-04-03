import { Box, Flex, useToast } from '@chakra-ui/react';
import React from 'react';
import { postAttendance } from '../../../../services/Attendance';
import { useAttendaceSubject } from '../../../../services/AttendanceSubject';
import { getError } from '../../../../utils/functions/utility';
import { showToast } from '../../../../utils/showToast';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import InputSelectComponent from '../../atoms/InputSelectComponent/InputSelectComponent';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import DropZoneLIstComponent from '../../molecules/DropZoneListComponent/DropZoneListComponent';
import ModalStructureComponent from '../../molecules/ModalStructureComponent/ModalStructureComponent';

export default function CreateAttendanceModalComponent(props: {
  showModal: boolean;
  setShowModal: () => void;
  reloadData: () => void;
}) {
  const toast = useToast();
  const [subjectId, setSubjectId] = React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [needAttachment, setNeedAttachment] = React.useState<boolean>(false);
  const subjectList = useAttendaceSubject();
  const [files, setFiles] = React.useState<File[]>([]);
  const [fileIds, setFileIds] = React.useState<string[]>([]);
  return (
    <ModalStructureComponent
      isOpen={props.showModal}
      onClose={() => props.setShowModal()}
      title={`Novo Chamado`}
      maxW="1200px"
      size="xl"
    >
      <Flex mb={5} justify={'space-between'}>
        <Box>
          <InputSelectComponent
            label="Assunto:"
            w={'300px'}
            m={'0'}
            placeholder={'Selecione um Assunto'}
            defaultValue={subjectId}
            onChange={(input) => {
              setSubjectId(input.target.value);
              setNeedAttachment(
                subjectList.data?.filter(
                  (item) => item.id === input.target.value
                )[0].mandatoryAttachment || false
              );
            }}
            options={subjectList.data?.map((item) => ({
              id: item.id,
              name: item.subject,
            }))}
          />
          {needAttachment && (
            <TextComponent color={'red'} fontSize="14px">
              * este assundo precisa de um arquivo anexado
            </TextComponent>
          )}
        </Box>
        <DropZoneLIstComponent
          files={files}
          setFiles={setFiles}
          fileIds={fileIds}
          setFileIds={setFileIds}
        />
      </Flex>
      <Flex mb={5} flexDirection={'column'}>
        <InputComponent
          marginBottom={2}
          label="Título"
          value={title}
          onChange={(input) => {
            setTitle(input.target.value);
          }}
        />
        <InputComponent
          label={'Descrição'}
          type={'textArea'}
          value={description}
          onChange={(input) => {
            setDescription(input.target.value);
          }}
        />
      </Flex>
      <Flex mb={5} justifyContent={'space-between'}>
        <ButtonComponent
          variant={'outline'}
          onSubmit={() => {
            setSubjectId('');
            setTitle('');
            setDescription('');
            props.setShowModal();
          }}
        >
          Descartar
        </ButtonComponent>
        <ButtonComponent
          onSubmit={() => {
            postAttendance({
              title,
              subjectId,
              description,
              attachmentIds: fileIds,
            })
              .then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Chamado criado com sucesso',
                });
                setSubjectId('');
                setTitle('');
                setDescription('');
                props.reloadData();
                props.setShowModal();
              })
              .catch((err) => {
                console.error(err);
                showToast({
                  toast,
                  status: 'error',
                  title: 'Error',
                  description: getError(err),
                });
              });
          }}
        >
          Criar Chamado
        </ButtonComponent>
      </Flex>
    </ModalStructureComponent>
  );
}

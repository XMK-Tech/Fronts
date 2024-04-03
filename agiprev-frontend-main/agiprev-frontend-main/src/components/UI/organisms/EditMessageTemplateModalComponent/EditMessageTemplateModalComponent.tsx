import {
  MessageTemplateResp,
  putMessageTemplate,
} from '../../../../services/MessageTemplatesService';
import React from 'react';
import ModalStructureComponent from '../../molecules/ModalStructureComponent/ModalStructureComponent';
import { Stack, FormLabel, useToast, Flex, Box } from '@chakra-ui/react';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import TextEditorComponent from '../TextEditorComponent/TextEditorComponent';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputCheckComponent from '../../atoms/InputCheckComponent/InputCheckComponent';
import { showToast } from '../../../../utils/showToast';
import {
  DynamicFieldsRespField,
  useDynamicFieldsByMessageTemplateId,
} from '../../../../services/DynamicFields';
import InputSelectComponent from '../../atoms/InputSelectComponent/InputSelectComponent';

export default function EditMessageTemplateModalComponent(props: {
  showModal: boolean;
  setShowModal: () => void;
  selectedMessageTemplate: MessageTemplateResp | undefined;
  onSave?: () => void;
}) {
  const toast = useToast();
  const [message, setMessage] = React.useState<string>('');
  const [templateName, setTemplateName] = React.useState<string>('');
  const [subject, setSubject] = React.useState<string>('');
  const [sendCopyMyself, setSendCopyMyself] = React.useState<boolean>(false);
  const listDynamicOptions = useDynamicFieldsByMessageTemplateId(
    props.selectedMessageTemplate?.id || ''
  );
  React.useEffect(() => {
    if (props.selectedMessageTemplate) {
      setMessage(props.selectedMessageTemplate.message);
      setTemplateName(props.selectedMessageTemplate.templateName);
      setSubject(props.selectedMessageTemplate.subject);
      setSendCopyMyself(props.selectedMessageTemplate.sendCopyMyself);
    }
  }, [props.selectedMessageTemplate]);
  return (
    <ModalStructureComponent
      isOpen={props.showModal}
      onClose={() => props.setShowModal()}
      title={`Editar Template ${props.selectedMessageTemplate?.code}`}
      size="full"
    >
      <Stack spacing={5}>
        <Flex justifyContent={'left'}>
          <InputComponent
            label="Nome do template"
            w={'45%'}
            value={templateName}
            onChange={(input) => setTemplateName(input.target.value)}
          />
          <InputCheckComponent
            size="lg"
            w="40%"
            m={'20px 0 0 190px'}
            isChecked={sendCopyMyself}
            onChange={() => setSendCopyMyself(!sendCopyMyself)}
          >
            Mardar cópia para mim mesmo?
          </InputCheckComponent>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <InputComponent
            label="Assunto"
            w={'45%'}
            value={subject}
            onChange={(input) => setSubject(input.target.value)}
          />
          <Flex direction={'column'} width={'45%'}>
            <InputSelectComponent
              label="Adicionar campo dinâmico"
              value={''}
              placeholder={'Selecione uma variável'}
              onChange={(input) => setMessage(message + input.target.value)}
              options={listDynamicOptions.data?.data
                .reduce(
                  (initial: DynamicFieldsRespField[], item) => [
                    ...initial,
                    ...item.fields,
                  ],
                  []
                )
                .map((item) => ({ id: item.code, name: item.code }))}
            />
          </Flex>
        </Flex>
        <Box>
          <FormLabel mb={0}>Mensagem</FormLabel>
          <TextEditorComponent
            value={message}
            setValue={(input) => setMessage(input)}
          />
        </Box>
        <Flex mt={10} mb={5} justifyContent={'end'}>
          <ButtonComponent
            onSubmit={() => {
              putMessageTemplate({
                id: props.selectedMessageTemplate?.id || '',
                templateName,
                subject,
                message,
                sendCopyMyself,
              })
                .then((resp) => {
                  showToast({
                    toast,
                    status: 'success',
                    title: 'Sucesso',
                    description: 'Salvo com sucesso',
                  });
                  props.onSave?.();
                  props.setShowModal();
                })
                .catch((err) => {
                  console.error(err);
                  showToast({
                    toast,
                    status: 'error',
                    title: 'Error',
                    description: 'Ocorreu um erro desconhecido',
                  });
                });
            }}
          >
            Salvar
          </ButtonComponent>
        </Flex>
      </Stack>
    </ModalStructureComponent>
  );
}

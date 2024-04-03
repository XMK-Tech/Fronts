import { Center, Flex, Stack, useToast } from '@chakra-ui/react';
import React from 'react';
import { showToast } from '../../../../utils/showToast';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import InputSelectComponent from '../../atoms/InputSelectComponent/InputSelectComponent';
import ModalStructureComponent from '../../molecules/ModalStructureComponent/ModalStructureComponent';
import {
  ExpenseAttachments,
  TypeExpenseAttachment,
  putExpenseAttachment,
} from '../../../../services/ExpenseService';
import { cnpjMask } from '../../../../utils/functions/masks';
import DropzoneModel from '../uploadModel/DropZoneModel';
import ArchiveListComponent from '../../molecules/ArchiveListComponent/ArchiveListComponent';
import { AttachmentType } from '../uploadModel/UploadApi';
import { validateOptionalFields } from '../../../../utils/functions/utility';

export function AttachExpenseModalComponent(props: {
  showModal: boolean;
  selectedExpenseId?: string;
  setShowModal: () => void;
  reloadData?: () => void;
}) {
  const toast = useToast();
  const defaultForm = React.useMemo(
    () => ({
      favored: '',
      document: '',
      contract: '',
      validity: '',
      description: '',
      type: 0,
      attachmentId: '',
    }),
    []
  );
  const [attachments, setAttachments] = React.useState<AttachmentType[]>([]);
  const [form, setForm] = React.useState<ExpenseAttachments>(defaultForm);
  return (
    <ModalStructureComponent
      isOpen={props.showModal}
      onClose={() => props.setShowModal()}
      title={`Anexo de arquivos`}
      size="lg"
    >
      <Flex mb={20} flexDirection={'row'} justifyContent={'center'}>
        <Center>
          <DropzoneModel
            type={'archive'}
            onUploadComplete={(responses) =>
              setAttachments([...attachments, ...responses])
            }
          />
        </Center>
      </Flex>
      <Flex mb={5} flexDirection={'row'} justifyContent={'center'}>
        <InputComponent
          label="Observação"
          placeholder="Digite a observação"
          w={'60%'}
          value={form.description}
          onChange={(input) => {
            setForm({ ...form, description: input.target.value });
          }}
        />
      </Flex>
      <Flex mb={5} flexDirection={'row'} justifyContent={'center'}>
        <InputComponent
          label="Favorecido"
          placeholder="Digite o Favorecido"
          w={'60%'}
          value={form.favored}
          onChange={(input) => {
            setForm({ ...form, favored: input.target.value });
          }}
        />
      </Flex>
      <Flex mb={5} flexDirection={'row'} justifyContent={'center'}>
        <InputComponent
          label="CNPJ"
          placeholder="Digite o CNPJ"
          w={'60%'}
          value={form.document}
          onChange={(input) => {
            setForm({ ...form, document: cnpjMask(input.target.value) });
          }}
        />
      </Flex>
      <Flex mb={5} flexDirection={'row'} justifyContent={'center'}>
        <InputComponent
          label="Contrato"
          placeholder="Digite o Contrato"
          w={'60%'}
          value={form.contract}
          onChange={(input) => {
            setForm({ ...form, contract: input.target.value });
          }}
        />
      </Flex>
      <Stack mb={5} flexDirection={'row'} justifyContent={'center'}>
        <InputComponent
          label="Vigência"
          placeholder="Digite a vigência"
          w={'60%'}
          value={form.validity}
          onChange={(input) => {
            setForm({ ...form, validity: input.target.value });
          }}
        />
      </Stack>
      <Flex mb={5} flexDirection={'row'} justifyContent={'center'}>
        <Flex direction={'column'} width={'60%'}>
          <InputSelectComponent
            defaultValue={form.type?.toString()}
            onChange={(input) => {
              setForm({ ...form, type: Number(input.target.value) });
            }}
            options={[
              {
                id: TypeExpenseAttachment.reinforcing?.toString(),
                name: 'Reforço de empenho',
              },
              {
                id: TypeExpenseAttachment.correction?.toString(),
                name: 'Correção de empenho',
              },
            ]}
            label="Tipo de empenho"
          />
        </Flex>
      </Flex>
      <ArchiveListComponent
        attachments={attachments}
        setAttachments={setAttachments}
      />
      <Flex mb={5} justifyContent={'space-between'}>
        <ButtonComponent
          variant={'outline'}
          onSubmit={() => {
            setForm(defaultForm);
            setAttachments([]);
            props.setShowModal();
          }}
        >
          Descartar
        </ButtonComponent>
        <ButtonComponent
          disabled={
            attachments.length === 0 ||
            validateOptionalFields(form, ['attachmentId', 'type'])
          }
          onSubmit={async () => {
            await Promise.all(
              attachments.map((attachment) =>
                putExpenseAttachment(
                  { ...form, attachmentId: attachment.id },
                  props.selectedExpenseId || ''
                )
              )
            );
            props.setShowModal();
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'Anexos salvos com sucesso',
            });
            setForm(defaultForm);
            setAttachments([]);
          }}
        >
          {'Anexar'}
        </ButtonComponent>
      </Flex>
    </ModalStructureComponent>
  );
}

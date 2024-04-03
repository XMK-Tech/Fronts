import { Center, Flex, useToast } from '@chakra-ui/react';
import React from 'react';
import { showToast } from '../../../../utils/showToast';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import InputSelectComponent from '../../atoms/InputSelectComponent/InputSelectComponent';
import ModalStructureComponent from '../../molecules/ModalStructureComponent/ModalStructureComponent';
import DropzoneModel from '../uploadModel/DropZoneModel';
import ArchiveListComponent from '../../molecules/ArchiveListComponent/ArchiveListComponent';
import { AttachmentType } from '../uploadModel/UploadApi';
import {
  CollectionAttachments,
  TypeCollection,
  putCollectionAttachment,
} from '../../../../services/CollectionService';
import * as yup from 'yup';
import { checkFormValue } from '../../../../utils/functions/utility';

export function AttachCollectionModalComponent(props: {
  showModal: boolean;
  selectedCollectionId?: string;
  setShowModal: () => void;
  reloadData?: () => void;
}) {
  const toast = useToast();
  const defaultForm = React.useMemo(
    () => ({
      description: '',
      type: 0,
      attachmentId: '',
    }),
    []
  );

  const formSchema = yup.object().shape({
    description: yup.string().required('Descrição é obrigatório'),
  });
  const [attachments, setAttachments] = React.useState<AttachmentType[]>([]);
  const [form, setForm] = React.useState<CollectionAttachments>(defaultForm);
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
          error={checkFormValue(form, formSchema, 'description')}
          value={form.description}
          onChange={(input) => {
            setForm({ ...form, description: input.target.value });
          }}
        />
      </Flex>
      <Flex mb={5} flexDirection={'row'} justifyContent={'center'}>
        <InputSelectComponent
          w={'60%'}
          defaultValue={form.type?.toString()}
          onChange={(input) => {
            setForm({ ...form, type: Number(input.target.value) });
          }}
          options={[
            {
              id: TypeCollection.voucher?.toString(),
              name: 'Comprovante',
            },
            {
              id: TypeCollection.darf?.toString(),
              name: 'DARF',
            },
          ]}
          label="Tipo de empenho"
        />
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
          disabled={attachments.length === 0 || !formSchema.isValidSync(form)}
          onSubmit={async () => {
            await Promise.all(
              attachments.map((attachment) =>
                putCollectionAttachment(
                  { ...form, attachmentId: attachment.id },
                  props.selectedCollectionId || ''
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

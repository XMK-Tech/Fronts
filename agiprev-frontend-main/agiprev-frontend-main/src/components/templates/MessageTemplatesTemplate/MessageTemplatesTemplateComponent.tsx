import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import {
  MessageTemplateResp,
  useMessageTemplates,
} from '../../../services/MessageTemplatesService';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import React from 'react';
import EditMessageTemplateModalComponent from '../../UI/organisms/EditMessageTemplateModalComponent/EditMessageTemplateModalComponent';

export default function MessageTemplatesTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const messageTemplates = useMessageTemplates(selectedPage, pageSize);
  const [selectedMessageTemplate, setSelectedMessageTemplate] =
    React.useState<MessageTemplateResp>();
  const [showModalTerms, setShowModalTerms] = useState(false);

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }

  return (
    <Flex p={4} flexDirection={'column'}>
      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <TitleTextComponent>Templates de Mensagem</TitleTextComponent>
      </Flex>

      <TableComponent
        ItemsHeader={[
          { item: 'Código' },
          { item: 'Nome do Template' },
          { item: 'Mandar cópia para mim mesmo' },
          { item: 'Ação' },
        ]}
        emptyState={messageTemplates.data?.data.length === 0}
        isLoading={messageTemplates.isLoading}
        data={
          messageTemplates.data?.data.map((e: MessageTemplateResp) => ({
            items: [
              e.code,
              e.templateName,
              e.sendCopyMyself ? 'Sim' : 'Não',
              <ButtonComponent
                onSubmit={() => {
                  setSelectedMessageTemplate(e);
                  setShowModalTerms(true);
                }}
              >
                Editar
              </ButtonComponent>,
            ],
          })) || []
        }
      />
      <PaginationComponent
        arrayLength={messageTemplates.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
      />

      <EditMessageTemplateModalComponent
        selectedMessageTemplate={selectedMessageTemplate}
        setShowModal={() => setShowModalTerms(false)}
        showModal={showModalTerms}
        onSave={() => {
          messageTemplates.refetch();
        }}
      />
    </Flex>
  );
}

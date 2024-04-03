import { FaSms } from 'react-icons/fa';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import SearchSelectComponent from '../../UI/molecules/SearchSelectComponent/SearchSelectComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import TextComponent from '../../UI/atoms/TextComponent/TextComponent';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import {
  AttendanceResp,
  AttendanceStatus,
  useAttendace,
} from '../../../services/Attendance';
import { formatDateAndHour } from '../../../utils/functions/formatDate';
import { useNavigate } from 'react-router-dom';

import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import CreateAttendanceModalComponent from '../../UI/organisms/CreateAttendanceModalComponent/CreateAttendanceModalComponent';
import { TabsFilterComponent } from '../../UI/organisms/TabsFilterComponent/TabsFilterComponent';
import { getStatusColorByTypeAttendance } from '../AttendanceTemplate/AttendanceTemplateComponent';

export default function AttendanceClientTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const [searchInput, search, setSearch] = useDebounce('');
  const [searchField, setSearchField] = React.useState('title');
  const [showModal, setShowModal] = React.useState(false);
  const [status, setStatus] = React.useState<AttendanceStatus | null>(null);

  const listAttendance = useAttendace(
    selectedPage,
    pageSize,
    search,
    searchField,
    'title',
    'asc',
    status,
    true
  );
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const navigate = useNavigate();
  const tabName = [
    {
      title: 'Todos',
      onClick: () => {
        setStatus(null);
      },
    },
    {
      title: 'Em aberto',
      onClick: () => {
        setStatus(AttendanceStatus.open);
      },
    },
    {
      title: 'Concluido',
      onClick: () => {
        setStatus(AttendanceStatus.finished);
      },
    },
  ];
  return (
    <>
      <Stack paddingBottom={5} justifyContent={'space-between'}>
        <TextComponent as={'b'} fontSize={'3xl'}>
          Meus Atendimentos
        </TextComponent>
      </Stack>
      <Stack
        direction={'row'}
        paddingBottom={5}
        justifyContent={'space-between'}
      >
        <TabsFilterComponent tabList={tabName} />
        <Flex>
          <ButtonComponent
            margin={'0 10px 0 0'}
            onSubmit={() => setShowModal(true)}
          >
            Novo Chamado
          </ButtonComponent>
          <SearchSelectComponent
            onChangeText={(input) => setSearch(input.target.value)}
            inputValue={searchInput}
            onClean={() => setSearch('')}
            onChangeSelect={(item) => {
              setSearchField(item.target.value);
            }}
            options={[
              { id: 'title', name: 'Título' },
              { id: 'responsibleName', name: 'Nome do Responsavel' },
            ]}
          />
        </Flex>
      </Stack>
      <TableComponent
        ItemsHeader={[
          { item: 'Assunto' },
          { item: 'Última interação' },
          { item: 'Abertura' },
          { item: 'Atendente' },
          { item: 'Status' },
          { item: 'Ação' },
        ]}
        isLoading={listAttendance.isLoading}
        centered={true}
        emptyState={listAttendance.data?.metadata.dataSize === 0}
        data={
          listAttendance.data?.data.map((e: AttendanceResp, i: number) => ({
            items: [
              e.subject,
              formatDateAndHour(e.lastHistoryUpdateAt),
              formatDateAndHour(e.date),
              e.responsibleName ? e.responsibleName : '-',
              getStatusColorByTypeAttendance(e.attendanceStatus),
              <>
                <IconButtonComponent
                  Icon={<FaSms />}
                  arialLabel="info"
                  marginX={2}
                  toolTipText="Chat"
                  colorScheme={'green'}
                  onSubmit={() => {
                    navigate(`/chat/${e.id}`);
                  }}
                />
              </>,
            ],
          })) || []
        }
      />
      <PaginationComponent
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
        arrayLength={listAttendance.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
      ></PaginationComponent>
      <CreateAttendanceModalComponent
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
        reloadData={() => listAttendance.refetch()}
      />
    </>
  );
}

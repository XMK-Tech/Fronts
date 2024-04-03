import { FaSms } from 'react-icons/fa';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { Flex, Stack } from '@chakra-ui/react';
import AvatarLabelComponent from '../../UI/atoms/AvatarLabelComponent/AvatarLabelComponent';
import React from 'react';
import SearchSelectComponent from '../../UI/molecules/SearchSelectComponent/SearchSelectComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import TextComponent from '../../UI/atoms/TextComponent/TextComponent';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import TagComponent from '../../UI/atoms/TagComponent/TagComponent';
import {
  AttendanceResp,
  AttendanceStatus,
  getAttendanceReport,
  useAttendace,
} from '../../../services/Attendance';
import { formatDateAndHour } from '../../../utils/functions/formatDate';
import { useNavigate } from 'react-router-dom';
import { TabsFilterComponent } from '../../UI/organisms/TabsFilterComponent/TabsFilterComponent';
import { SortDirection } from '../../../services/PhysicalPersonService';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';

export default function AttendanceTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const [searchInput, search, setSearch] = useDebounce('');
  const [searchField, setSearchField] = React.useState('title');
  const [status, setStatus] = React.useState<AttendanceStatus | null>(null);
  const [myAttendances, setMyAttendances] = React.useState(false);
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('desc');
  const [sort, setSort] = React.useState<string>('createdAt');
  const listAttendance = useAttendace(
    selectedPage,
    pageSize,
    search,
    searchField,
    sort,
    sortDirection,
    status,
    myAttendances
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
        setMyAttendances(false);
      },
    },
    {
      title: 'Em aberto',
      onClick: () => {
        setStatus(AttendanceStatus.open);
        setMyAttendances(false);
      },
    },
    {
      title: 'Concluido',
      onClick: () => {
        setStatus(AttendanceStatus.finished);
        setMyAttendances(false);
      },
    },
    {
      title: 'Meus Atendimentos',
      onClick: () => {
        setMyAttendances(true);
        setStatus(null);
      },
    },
  ];

  return (
    <>
      <Stack paddingBottom={5} justifyContent={'space-between'}>
        <TextComponent as={'b'} fontSize={'3xl'}>
          Atendimento
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
            onSubmit={() =>
              getAttendanceReport(
                search,
                searchField,
                sort,
                sortDirection,
                status,
                myAttendances
              )
            }
          >
            Exportar
          </ButtonComponent>
          <SearchSelectComponent
            onChangeText={(input) => setSearch(input.target.value)}
            inputValue={searchInput}
            onClean={() => setSearch('')}
            onChangeSelect={(item) => {
              setSearchField(item.target.value);
            }}
            options={[
              { id: 'subject', name: 'Assunto' },
              { id: 'requesterName', name: 'Solicitante' },
              { id: 'responsibleName', name: 'Atendente' },
              { id: 'serialNumber', name: 'Ticket' },
            ]}
          />
        </Flex>
      </Stack>
      <TableComponent
        ItemsHeader={[
          {
            item: 'Solicitante',
            sort: 'requestername',
          },
          {
            item: 'Ticket',
            sort: 'serialNumber',
          },
          {
            item: 'Assunto',
            sort: 'subject',
          },
          {
            item: 'Abertura',
            sort: 'createdAt',
          },
          {
            item: 'Atendente',
            sort: 'responsiblename',
          },
          {
            item: 'Status',
            sort: 'status',
          },
          { item: 'Ação' },
        ]}
        isLoading={listAttendance.isLoading}
        centered={true}
        emptyState={listAttendance.data?.metadata.dataSize === 0}
        sorting={{ sortColumn: sort, direction: sortDirection }}
        onSortingChanged={(sort, dir) => {
          setSort(sort);
          setSortDirection(dir);
        }}
        data={
          listAttendance.data?.data.map((e: AttendanceResp, i: number) => ({
            items: [
              <AvatarLabelComponent key={i} label={e.requesterName} />,
              e.serialNumber,
              e.subject,
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
    </>
  );
}

export function getStatusColorByTypeAttendance(type: AttendanceStatus) {
  switch (type) {
    case AttendanceStatus.open:
      return <TagComponent size={'md'} colorScheme={'blue'} text="Aberto" />;
    case AttendanceStatus.canceled:
      return <TagComponent size={'md'} colorScheme={'teal'} text="Cancelado" />;
    case AttendanceStatus.attending:
      return (
        <TagComponent size={'md'} colorScheme={'yellow'} text="Atendendo" />
      );
    default:
      return (
        <TagComponent size={'md'} colorScheme={'green'} text="Finalizado" />
      );
  }
}

import { FaInfo, FaSms, FaTrash } from 'react-icons/fa';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { Box, Stack, Tab, TabList, Tabs } from '@chakra-ui/react';
import AvatarLabelComponent from '../../UI/atoms/AvatarLabelComponent/AvatarLabelComponent';
import React from 'react';
import SearchSelectComponent from '../../UI/molecules/SearchSelectComponent/SearchSelectComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import TagComponent from '../../UI/atoms/TagComponent/TagComponent';
import {
  AttendanceResp,
  AttendanceStatus,
  useAttendace,
} from '../../../services/Attendance';
import { parseDate } from '../../../utils/functions/utility';
import { useNavigate } from 'react-router-dom';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
export default function CalledTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const [searchInput, search, setSearch] = useDebounce('');
  const [searchField, setSearchField] = React.useState('title');
  const listAttendance = useAttendace(
    selectedPage,
    pageSize,
    search,
    searchField
  );
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const navigate = useNavigate();

  return (
    <>
      <Stack paddingBottom={5} justifyContent={'space-between'}>
        <TitleTextComponent>Chamados</TitleTextComponent>
      </Stack>
      <Stack
        direction={'row'}
        paddingBottom={5}
        justifyContent={'space-between'}
      >
        <Tabs variant="unstyled">
          <TabList>
            <Tab
              fontWeight="600"
              mr={2}
              bg={'gray.200'}
              borderRadius={5}
              _selected={{ color: 'white', fontWeight: '600', bg: 'blue.500' }}
            >
              Todos
            </Tab>
            <Tab
              fontWeight="600"
              mr={2}
              bg={'gray.200'}
              borderRadius={5}
              _selected={{ color: 'white', fontWeight: '600', bg: 'blue.500' }}
            >
              Meus Chamados
            </Tab>
            <Tab
              fontWeight="600"
              mr={2}
              bg={'gray.200'}
              borderRadius={5}
              _selected={{ color: 'white', fontWeight: '600', bg: 'blue.500' }}
            >
              Em Aberto
            </Tab>
            <Tab
              fontWeight="600"
              bg={'gray.200'}
              borderRadius={5}
              _selected={{ color: 'white', fontWeight: '600', bg: 'blue.500' }}
            >
              Concluídos
            </Tab>
          </TabList>
        </Tabs>

        <Box>
          <SearchSelectComponent
            onChangeText={(input) => setSearch(input.target.value)}
            inputValue={searchInput}
            onClean={() => setSearch('')}
            onChangeSelect={(item) => {
              setSearchField(item.target.value);
            }}
            options={[
              { id: 'title', name: 'title' },
              { id: 'requesterName', name: 'Nome do Solicitante' },
              { id: 'responsibleName', name: 'Nome do Responsavel' },
            ]}
          />
        </Box>
      </Stack>
      <TableComponent
        ItemsHeader={[
          { item: 'Nome' },
          { item: 'Documento' },
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
              <AvatarLabelComponent key={i} label={e.requesterName} />,
              e.requesterDocument,
              parseDate(String(e.date)),
              e.responsibleName,
              getStatusColorByType(e.attendanceStatus),
              <>
                <IconButtonComponent
                  Icon={<FaInfo />}
                  arialLabel="info"
                  onSubmit={() => {}}
                />
                <IconButtonComponent
                  Icon={<FaSms />}
                  arialLabel="info"
                  margin={15}
                  colorScheme={'green'}
                  onSubmit={() => {
                    navigate(`/chat/${e.id}`);
                  }}
                />
                <IconButtonComponent
                  Icon={<FaTrash />}
                  arialLabel="info"
                  colorScheme={'red'}
                  onSubmit={() => {}}
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

export function getStatusColorByType(type: AttendanceStatus) {
  switch (type) {
    case AttendanceStatus.open:
      return <TagComponent size={'md'} colorScheme={'blue'} text="Aberto" />;
    case AttendanceStatus.attending:
      return <TagComponent size={'md'} colorScheme={'teal'} text="Análise" />;
    case AttendanceStatus.canceled:
      return (
        <TagComponent size={'md'} colorScheme={'yellow'} text="Negociação" />
      );
    default:
      return (
        <TagComponent size={'md'} colorScheme={'green'} text="Concluído" />
      );
  }
}

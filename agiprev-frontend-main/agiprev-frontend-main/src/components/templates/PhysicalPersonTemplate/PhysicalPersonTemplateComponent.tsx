import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import {
  FaEye,
  FaFileCode,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
} from 'react-icons/fa';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { Flex, Stack } from '@chakra-ui/react';
import AvatarLabelComponent from '../../UI/atoms/AvatarLabelComponent/AvatarLabelComponent';
import {
  usePhysicalPerson,
  PhysicalPersonResp,
  usePhysicalPersonReport,
} from '../../../services/PhysicalPersonService';
import React from 'react';
import DetailsModalComponent from '../../UI/molecules/DetailsModalComponent/DetailsModalComponent';
import SearchSelectComponent from '../../UI/molecules/SearchSelectComponent/SearchSelectComponent';
import MenuButtonComponent from '../../UI/molecules/MenuButtonComponent/MenuButtonComponent';
import { cpfMask, phoneMask } from '../../../utils/functions/masks';
import { useDebounce } from '../../../utils/functions/debounce';
import InputCheckComponent from '../../UI/atoms/InputCheckComponent/InputCheckComponent';
import PermissionsModalComponent from '../../UI/organisms/PermissionsModalComponent/PermissionsModalComponent';

import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';

export default function PhysicalPersonTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const [searchInput, search, setSearch] = useDebounce('');
  const [searchField, setSearchField] = React.useState('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'asc'
  );
  const [onlyUsers, setOnlyUsers] = React.useState(false);
  const [sort, setSort] = React.useState<string>('name');
  const listPerson = usePhysicalPerson(
    selectedPage,
    pageSize,
    search,
    searchField,
    sort,
    sortDirection,
    onlyUsers
  );
  const [reportType, setReportType] = React.useState<number>(-1);
  usePhysicalPersonReport(
    reportType,
    setReportType,
    selectedPage,
    pageSize,
    search,
    searchField
  );
  const [detailsDialog, setDetailsDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<PhysicalPersonResp>();
  const modalCardInfo = [
    { item: 'Nome', description: selectedUser?.firstName },
    { item: 'Email', description: selectedUser?.userEmail },
    { item: 'Telefone', description: phoneMask(selectedUser?.phone) },
    { item: 'Documento', description: cpfMask(selectedUser?.document) },
    { item: 'Empresa', description: selectedUser?.companyDisplayName },
    { item: 'Posição', description: selectedUser?.employeePosition },
  ];
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }

  return (
    <>
      <Stack
        paddingBottom={5}
        alignItems={'center'}
        justifyContent={'space-between'}
        direction="row"
      >
        <TitleTextComponent>Pessoas Físicas</TitleTextComponent>
        <SearchSelectComponent
          onChangeText={(input) => setSearch(input.target.value)}
          inputValue={searchInput}
          onClean={() => setSearch('')}
          onChangeSelect={(item) => {
            setSearchField(item.target.value);
          }}
          options={[
            { id: 'name', name: 'Nome' },
            { id: 'email', name: 'Email' },
            { id: 'phone', name: 'Telefone' },
            { id: 'document', name: 'Documento' },
          ]}
        />
      </Stack>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <MenuButtonComponent
          label={'Exportar'}
          m={'0 10px 10px 0'}
          items={[
            {
              icon: <FaFileCsv />,
              label: 'CSV',
              onClick: () => setReportType(0),
            },
            {
              icon: <FaFilePdf />,
              label: 'PDF',
              onClick: () => setReportType(1),
            },
            {
              icon: <FaFileCode />,
              label: 'XML',
              onClick: () => setReportType(2),
            },
            {
              icon: <FaFileExcel />,
              label: 'XLSX',
              onClick: () => setReportType(3),
            },
          ]}
        />
        <InputCheckComponent
          isChecked={onlyUsers}
          size={'lg'}
          onChange={() => setOnlyUsers(!onlyUsers)}
        >
          Somente Usuários
        </InputCheckComponent>
      </Flex>
      <TableComponent
        ItemsHeader={[
          { item: 'nome', sort: 'name' },
          { item: 'email', sort: 'email' },
          { item: 'telefone', sort: 'phone' },
          { item: 'documento', sort: 'document' },
          { item: 'ações' },
        ]}
        onSortingChanged={(sort, dir) => {
          setSort(sort);
          setSortDirection(dir);
        }}
        isLoading={listPerson.isLoading}
        sorting={{ sortColumn: sort, direction: sortDirection }}
        emptyState={listPerson.data?.metadata.dataSize === 0}
        data={
          listPerson.data?.data.map((e: PhysicalPersonResp) => ({
            items: [
              <AvatarLabelComponent label={e.firstName} />,
              e.userEmail,
              phoneMask(e.phone),
              cpfMask(e.document),
              <ButtonComponent
                leftIcon={<FaEye />}
                onSubmit={() => {
                  setDetailsDialog(true);
                  setSelectedUser(e);
                }}
              >
                Detalhes
              </ButtonComponent>,
            ],
          })) || []
        }
      />

      <PaginationComponent
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
        arrayLength={listPerson.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
      ></PaginationComponent>

      <DetailsModalComponent
        isOpen={detailsDialog}
        title={'Pessoa Física'}
        infoCard={
          selectedUser?.userId && (
            <PermissionsModalComponent selectedUser={selectedUser} />
          )
        }
        onClose={() => setDetailsDialog(false)}
        data={modalCardInfo}
        editLink={`/user-register/${selectedUser?.id}/1`}
        imgUrl={selectedUser?.profilePicUrl}
      />
    </>
  );
}

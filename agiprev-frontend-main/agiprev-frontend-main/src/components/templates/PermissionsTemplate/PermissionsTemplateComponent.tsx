import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { Stack } from '@chakra-ui/react';
import React from 'react';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import {
  PermissionResp,
  usePermissions,
} from '../../../services/PermissionService';
import { useDebounce } from '../../../utils/functions/debounce';
import UsersModalComponent from '../../UI/organisms/UsersModalComponent/UsersModalComponent';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';

export default function PermissionsTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const [searchInput, search, setSearch] = useDebounce('');
  const listPermission = usePermissions(selectedPage, pageSize, search);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedPermission, setSelectedPermission] =
    React.useState<PermissionResp>();
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
        <TitleTextComponent>Permissões</TitleTextComponent>
        <SearchComponent
          value={searchInput}
          onClean={() => setSearch('')}
          onChange={(input) => setSearch(input.target.value)}
        />
      </Stack>
      <TableComponent
        ItemsHeader={[
          { item: 'código' },
          { item: 'nome' },
          { item: 'descrição' },
          { item: 'ações' },
        ]}
        isLoading={listPermission.isLoading}
        data={
          listPermission.data?.data.map((e: PermissionResp) => ({
            items: [
              e.code,
              e.name,
              e.description,
              <ButtonComponent
                onSubmit={() => {
                  setSelectedPermission(e);
                  setShowModal(true);
                }}
              >
                Atribuir
              </ButtonComponent>,
            ],
          })) || []
        }
      />

      <PaginationComponent
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
        arrayLength={listPermission.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
      ></PaginationComponent>
      <UsersModalComponent
        setShowModal={() => setShowModal(false)}
        showModal={showModal}
        selectedPermission={selectedPermission}
      />
    </>
  );
}

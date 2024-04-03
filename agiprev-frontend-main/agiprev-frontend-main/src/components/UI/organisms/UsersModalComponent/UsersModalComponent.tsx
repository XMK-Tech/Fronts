import ButtonComponent from '../../../UI/atoms/ButtonComponent/ButtonComponent';
import TableComponent from '../../../UI/molecules/TableComponent/TableComponent';
import { PaginationComponent } from '../../../UI/molecules/PaginationComponent/PaginationComponent';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import SearchComponent from '../../../UI/atoms/SearchComponent/SearchComponent';
import {
  PermissionResp,
  usePermissionDialog,
} from '../../../../services/PermissionService';
import ModalStructureComponent from '../../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import {
  PhysicalPersonResp,
  SortDirection,
  usePhysicalPerson,
} from '../../../../services/PhysicalPersonService';
import InputSelectComponent from '../../../UI/atoms/InputSelectComponent/InputSelectComponent';

export default function UsersModalComponent(props: {
  showModal: boolean;
  setShowModal: () => void;
  selectedPermission?: PermissionResp;
}) {
  const {
    pageSize,
    selectedPage,
    searchInput,
    search,
    setSearch,
    management,
    setManagement,
    onSelectedPageChanged,
    assignRemovePermission,
  } = usePermissionDialog();
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('name');
  const listUser = usePhysicalPerson(
    selectedPage,
    pageSize,
    search,
    'name',
    sort,
    sortDirection,
    true
  );
  return (
    <ModalStructureComponent
      isOpen={props.showModal}
      onClose={() => props.setShowModal()}
      title={`Permissão: ${props.selectedPermission?.name}`}
      maxW="1200px"
      size="xl"
    >
      <Flex mb={5} justifyContent={'space-between'} alignItems={'center'}>
        <InputSelectComponent
          label="Nível de permissão para modificar a permissão:"
          w={'300px'}
          m={'0'}
          defaultValue={management.toString()}
          onChange={(input) => setManagement(Number(input.target.value))}
          options={[
            { id: '0', name: 'Nenhuma' },
            { id: '1', name: 'Atribuir' },
            { id: '2', name: 'Remover' },
            { id: '3', name: 'Completo' },
          ]}
        />
      </Flex>
      <Flex mb={5} justifyContent={'end'}>
        <SearchComponent
          value={searchInput}
          onClean={() => setSearch('')}
          onChange={(input) => setSearch(input.target.value)}
        />
      </Flex>
      <TableComponent
        ItemsHeader={[
          { item: 'Nome', sort: 'name' },
          { item: 'Email', sort: 'email' },
          { item: 'Atribuído' },
          { item: 'Ações' },
        ]}
        onSortingChanged={(sort, dir) => {
          setSort(sort);
          setSortDirection(dir);
        }}
        sorting={{ sortColumn: sort, direction: sortDirection }}
        emptyState={listUser.data?.metadata.dataSize === 0}
        isLoading={listUser.isLoading}
        data={
          listUser.data?.data.map((e: PhysicalPersonResp) => ({
            items: [
              e.firstName,
              e.userEmail,
              e.permissions.filter(
                (permission) =>
                  permission.permissionId === props.selectedPermission?.id
              )[0]?.managementText || '-----',
              <>
                <ButtonComponent
                  onSubmit={() => {
                    assignRemovePermission(
                      props.selectedPermission,
                      e,
                      true
                    ).then(() => listUser.refetch());
                  }}
                >
                  Atribuir
                </ButtonComponent>
                <ButtonComponent
                  margin={'0 0 0 20px'}
                  colorScheme={'red'}
                  onSubmit={() => {
                    assignRemovePermission(
                      props.selectedPermission,
                      e,
                      false
                    ).then(() => listUser.refetch());
                  }}
                >
                  Remover
                </ButtonComponent>
              </>,
            ],
          })) || []
        }
      />
      <PaginationComponent
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
        arrayLength={listUser.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
      ></PaginationComponent>
    </ModalStructureComponent>
  );
}

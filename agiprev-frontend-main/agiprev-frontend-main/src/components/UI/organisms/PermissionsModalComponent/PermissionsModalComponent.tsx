import ButtonComponent from '../../../UI/atoms/ButtonComponent/ButtonComponent';
import TableComponent from '../../../UI/molecules/TableComponent/TableComponent';
import { PaginationComponent } from '../../../UI/molecules/PaginationComponent/PaginationComponent';
import { Flex } from '@chakra-ui/react';
import SearchComponent from '../../../UI/atoms/SearchComponent/SearchComponent';
import {
  PermissionResp,
  usePermissions,
  usePermissionDialog,
} from '../../../../services/PermissionService';
import { PhysicalPersonResp } from '../../../../services/PhysicalPersonService';
import InputSelectComponent from '../../../UI/atoms/InputSelectComponent/InputSelectComponent';
import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';

export default function PermissionsModalComponent(props: {
  selectedUser?: PhysicalPersonResp;
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
  const listPermission = usePermissions(selectedPage, pageSize, search);
  return (
    <>
      <TitleTextComponent children={'Permissões do usuário'} />
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
          { item: 'Nome' },
          { item: 'Atribuído' },
          { item: 'Ações' },
        ]}
        emptyState={listPermission.data?.metadata.dataSize === 0}
        isLoading={listPermission.isLoading}
        data={
          listPermission.data?.data.map((e: PermissionResp) => ({
            items: [
              e.name,
              e.users.filter(
                (user) => user.userId === props.selectedUser?.userId
              )[0]?.managementText || '-----',
              <>
                <ButtonComponent
                  onSubmit={() => {
                    assignRemovePermission(e, props.selectedUser, true).then(
                      () => listPermission.refetch()
                    );
                  }}
                >
                  Atribuir
                </ButtonComponent>
                <ButtonComponent
                  margin={'0 0 0 20px'}
                  colorScheme={'red'}
                  onSubmit={() => {
                    assignRemovePermission(e, props.selectedUser, false).then(
                      () => listPermission.refetch()
                    );
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
        arrayLength={listPermission.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
      ></PaginationComponent>
    </>
  );
}

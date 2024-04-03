import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import { Flex } from '@chakra-ui/react';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import React from 'react';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { useIsWeb } from '../../../hooks/useIsWeb';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import { FaInfo, FaShieldAlt } from 'react-icons/fa';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import ModalStructureComponent from '../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../UI/molecules/ContentModalIconComponent/ContentModalIconComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import { formatDate } from '../../../utils/functions/formatDate';
import DetailsComponent from '../../UI/atoms/DetailsComponent/DetailsComponet';
import { SortDirection } from '../../../services/PhysicalPersonService';
import { useUser, useUserId, userResp } from '../../../services/userService';
import TagComponent from '../../UI/atoms/TagComponent/TagComponent';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../../services/LoginService';
import { useExistsPermission } from '../../../services/PermissionService';

type FilterOptionsUser = {
  entityId: string;
  name: string;
  email: string;
};

export default function UsersTemplateComponent() {
  const navigate = useNavigate();
  const entityId = useUserData();
  const [userId, setUserId] = React.useState('');
  const notAddPermission = !useExistsPermission('users', 'add');
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const userDatails = useUserId(userId || '');
  const isWeb = useIsWeb();
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('name');
  const [showFilter, setShowFilter] = React.useState(false);
  const [showModalDetails, setShowModalDetails] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');

  const [filterOptionsUser, setFilterOptionsUser] =
    React.useState<FilterOptionsUser>({
      entityId: entityId?.entity ?? '',
      name: '',
      email: '',
    });

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const listUser = useUser(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsUser.entityId,
    filterOptionsUser.name,
    filterOptionsUser.email
  );

  const itemsBodyTable = (e: userResp) => {
    const mobileColumns = [e.fullName, e.email];

    const buttons = (
      <Flex>
        <IconButtonComponent
          toolTipText="Detalhes"
          arialLabel="Detalhes"
          Icon={<FaInfo />}
          onSubmit={() => {
            setUserId(e.id);
            setShowModalDetails(true);
          }}
          backgroundColor={'purple.500'}
        />
        <IconButtonComponent
          marginX={1}
          arialLabel="userPermissions"
          toolTipText="Permissões do Usuário"
          Icon={<FaShieldAlt />}
          onSubmit={() => navigate(`/user-permission-edit/${e.id}`)}
          backgroundColor={'green.500'}
        />
      </Flex>
    );

    if (!isWeb) {
      return [...mobileColumns, buttons];
    }
    return [
      ...mobileColumns,
      e.logCount,
      formatDate(e.lastLogin),
      getIsVerifiedToken(e.isVerified),
      buttons,
    ];
  };

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Usuário</TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar a lista de Usuários cadastrados
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          <Flex>
            <ButtonComponent
              margin={'0 10px 0 0'}
              disabled={notAddPermission}
              onSubmit={() => navigate('/user-edit')}
            >
              Cadastrar Usuário
            </ButtonComponent>
          </Flex>
          {
            <Flex>
              {isWeb && (
                <SearchComponent
                  value={searchInput}
                  onClean={() => setSearch('')}
                  onChange={(input) => setSearch(input.target.value)}
                />
              )}
              <FilterUser
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                setFilterOptionsUser={setFilterOptionsUser}
              />
            </Flex>
          }
        </Flex>

        <TableComponent
          centered
          ItemsHeader={[
            { item: 'nome', sort: 'username' },
            { item: 'email', sort: 'email' },
            { item: 'quantidade de logs', hideOnMobile: true },
            { item: 'ultimo login efetuado', hideOnMobile: true },
            { item: 'token', hideOnMobile: true },
            { item: 'ações' },
          ]}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listUser.data?.metadata.dataSize === 0}
          isLoading={listUser.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={
            listUser.data?.data.map((e: userResp) => ({
              items: itemsBodyTable(e),
            })) || []
          }
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listUser.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
      <ModalStructureComponent
        size={'xl'}
        title={'Detalhes'}
        description="Informações"
        isOpen={showModalDetails}
        onClose={() => setShowModalDetails(false)}
        children={
          <ContentModalIconComponent
            alignItems="flex-start"
            secondaryButton={{
              label: 'Fechar',
              onClick: () => setShowModalDetails(false),
            }}
            body={
              <>
                <DetailsComponent
                  label="Nome"
                  value={userDatails.data?.fullname}
                />
                <DetailsComponent
                  label="Email"
                  value={userDatails.data?.email}
                />
                <DetailsComponent
                  label="Quantidade de Logs"
                  value={userDatails.data?.logCount}
                />
                <DetailsComponent
                  label="Ultimo Login Efetuado"
                  value={formatDate(userDatails.data?.lastLogin)}
                />
              </>
            }
          />
        }
      />
    </>
  );
}
function FilterUser(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsUser: React.Dispatch<React.SetStateAction<FilterOptionsUser>>;
}) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const entityId = useUserData();

  function searchFilter() {
    return props.setFilterOptionsUser({
      entityId: entityId?.entity ?? '',
      name: name,
      email: email,
    });
  }
  function cleanFilter() {
    return (
      setName(''),
      setEmail(''),
      props.setFilterOptionsUser({
        name: '',
        email: '',
        entityId: entityId?.entity ?? '',
      })
    );
  }
  return (
    <FilterComponent
      onClean={cleanFilter}
      onSearch={searchFilter}
      setShowFilter={props.setShowFilter}
      showFilter={props.showFilter}
      bodyFilter={
        <Flex flexWrap={'wrap'}>
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Nome"
            placeholder="Digite o Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Email "
            placeholder="Digite o Email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Flex>
      }
    />
  );
}

export function getIsVerifiedToken(IsVerified: Boolean) {
  if (IsVerified) {
    return <TagComponent size={'md'} colorScheme={'green'} text="Validado" />;
  } else {
    return <TagComponent size={'md'} colorScheme={'yellow'} text="Pendente" />;
  }
}

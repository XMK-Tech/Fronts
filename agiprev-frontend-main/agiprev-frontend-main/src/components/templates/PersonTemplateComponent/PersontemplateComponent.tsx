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
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import { formatDate } from '../../../utils/functions/formatDate';
import { SortDirection } from '../../../services/PhysicalPersonService';
import { PersonResp, usePerson } from '../../../services/PersonService';
import TextComponent from '../../UI/atoms/TextComponent/TextComponent';
import { useNavigate } from 'react-router';
import { useExistsPermission } from '../../../services/PermissionService';

type FilterOptionsPerson = {
  name: string;
  document: string;
  displayName: string;
  initialDate: string;
  endDate: string;
  generalRecord: string;
};

export default function PersonTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const isWeb = useIsWeb();
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('name');
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const notAddPermission = !useExistsPermission('person', 'add');

  const [filterOptionsPerson, setFilterOptionsPerson] =
    React.useState<FilterOptionsPerson>({
      displayName: '',
      document: '',
      endDate: '',
      generalRecord: '',
      initialDate: '',
      name: '',
    });
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const listPerson = usePerson(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsPerson.name,
    filterOptionsPerson.document,
    filterOptionsPerson.displayName,
    filterOptionsPerson.initialDate,
    filterOptionsPerson.endDate,
    filterOptionsPerson.generalRecord
  );
  const itemsHeaderTable = [
    { item: 'nome', sort: 'nome' },
    { item: 'email', sort: 'email' },
    { item: 'data de cadastro', sort: 'date', hideOnMobile: true },
    { item: 'ações' },
  ];

  const itemsBodyTable = (e: PersonResp) => {
    const mobileColumns = [e.name, e.emails[0]];

    const buttons = (
      <Flex style={{ justifyContent: 'center' }}>
        {e.hasUser ? (
          <TextComponent color={'green.500'} fontWeight={'600'}>
            Acesso Liberado
          </TextComponent>
        ) : (
          <ButtonComponent disabled margin={'0 10px 0 0'} onSubmit={() => {}}>
            Liberar Acesso
          </ButtonComponent>
        )}
      </Flex>
    );

    if (!isWeb) {
      return [...mobileColumns, buttons];
    }
    return [...mobileColumns, formatDate(e.createdAt), buttons];
  };

  const navigate = useNavigate();

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Pessoas</TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar a lista de Pessoas
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          <Flex>
            <ButtonComponent
              margin={'0 10px 0 0'}
              disabled={notAddPermission}
              onSubmit={() => {
                navigate('/person-register');
              }}
            >
              Cadastrar Pessoa
            </ButtonComponent>
          </Flex>

          <Flex>
            {isWeb && (
              <SearchComponent
                value={searchInput}
                onClean={() => setSearch('')}
                onChange={(input) => setSearch(input.target.value)}
              />
            )}
            <FilterPerson
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              setFilterOptionsPerson={setFilterOptionsPerson}
            />
          </Flex>
        </Flex>
        <TableComponent
          centered
          ItemsHeader={itemsHeaderTable}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listPerson.data?.metadata.dataSize === 0}
          isLoading={listPerson.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={
            listPerson.data?.data.map((e: PersonResp) => ({
              items: itemsBodyTable(e),
            })) || []
          }
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listPerson.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
    </>
  );
}
function FilterPerson(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsPerson: React.Dispatch<
    React.SetStateAction<FilterOptionsPerson>
  >;
}) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [createdDate, setCreatedDate] = React.useState('');
  function searchFilter() {
    return props.setFilterOptionsPerson({
      displayName: email,
      name: name,
      document: '',
      endDate: '',
      generalRecord: '',
      initialDate: createdDate,
    });
  }
  function cleanFilter() {
    return (
      setEmail(''),
      setName(''),
      setCreatedDate(''),
      props.setFilterOptionsPerson({
        displayName: '',
        name: '',
        document: '',
        endDate: '',
        generalRecord: '',
        initialDate: '',
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
            label="Email"
            placeholder="Digite o Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Data de cadastro"
            placeholder="Digite a data de cadastro"
            type="date"
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
          />
        </Flex>
      }
    />
  );
}

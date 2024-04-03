import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import { Flex, useToast } from '@chakra-ui/react';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import React from 'react';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { useIsWeb } from '../../../hooks/useIsWeb';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import { FaInfo, FaPencilAlt, FaPlus, FaSync, FaTrash } from 'react-icons/fa';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import { formatDate } from '../../../utils/functions/formatDate';
import { SortDirection } from '../../../services/PhysicalPersonService';
import {
  RubricResp,
  deleteRubric,
  useRubric,
} from '../../../services/RubricService';
import { useNavigate } from 'react-router-dom';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import { useUserData } from '../../../services/LoginService';
import { DeleteModalComponent } from '../../UI/molecules/DeleteModalComponent/DeleteModalComponent';
import { showToast } from '../../../utils/showToast';
import { useExistsPermission } from '../../../services/PermissionService';

type FilterOptionsRubric = {
  name: string;
  effectiveDate: string;
  state: string;
};

export default function RubricTemplateComponent() {
  const user = useUserData();
  const toast = useToast();
  const navigate = useNavigate();
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const isWeb = useIsWeb();
  const notAddPermission = !useExistsPermission('rubric', 'add');
  const notEditPermission = !useExistsPermission('rubric', 'edit');
  const notDeletePermission = !useExistsPermission('rubric', 'delete');
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('name');
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [rubricId, setRubricId] = React.useState('');
  const [filterOptionsRubric, setFilterOptionsRubric] =
    React.useState<FilterOptionsRubric>({
      effectiveDate: '',
      name: '',
      state: '',
    });

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const listRubric = useRubric(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsRubric.name,
    filterOptionsRubric.state,
    filterOptionsRubric.effectiveDate,
    user?.year || ''
  );
  const itemsHeaderTable = [
    { item: 'nome', sort: 'name' },
    { item: 'estado', sort: 'stateName' },
    { item: 'data de vigência', sort: 'reference', hideOnMobile: true },
    { item: 'ações' },
  ];
  const itemsBodyTable = (e: RubricResp) => {
    const mobileColumns = [e.name, e.stateName];

    const buttons = (
      <Flex>
        <IconButtonComponent
          toolTipText="Cadastro de conta"
          arialLabel="Cadastro de conta"
          disabled={notEditPermission}
          Icon={<FaPlus />}
          onSubmit={() => {
            navigate(`/rubric-details/${e.id}/account-edit`);
          }}
          backgroundColor={'green.500'}
        />
        <IconButtonComponent
          disabled
          marginX={1}
          toolTipText="Restaurar Conta"
          arialLabel="Restaurar Conta"
          Icon={<FaSync />}
          onSubmit={() => {}}
          backgroundColor={'yellow.500'}
        />
        <IconButtonComponent
          toolTipText="Detalhes"
          arialLabel="Detalhes"
          Icon={<FaInfo />}
          onSubmit={() => {
            navigate(`/rubric-details/${e.id}`);
          }}
          backgroundColor={'purple.500'}
        />
        <IconButtonComponent
          marginX={1}
          arialLabel="Editar"
          toolTipText="Editar"
          disabled={notEditPermission}
          Icon={<FaPencilAlt />}
          onSubmit={() => {
            navigate(`/rubric-edit/${e.id}`);
          }}
          backgroundColor={'blue.500'}
        />
        <IconButtonComponent
          toolTipText="Excluir"
          arialLabel="Excluir"
          disabled={notDeletePermission}
          Icon={<FaTrash />}
          onSubmit={() => {
            setRubricId(e.id);
            setShowDelete(true);
          }}
        />
      </Flex>
    );

    if (!isWeb) {
      return [...mobileColumns, buttons];
    }
    return [...mobileColumns, formatDate(e.reference), buttons];
  };
  const stateList = listRubric.data?.data.map((e: RubricResp) => ({
    id: e.stateId,
    name: e.stateName,
  }));

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Modelos</TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar os Modelos
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          <Flex>
            <ButtonComponent
              margin={'0 10px 0 0'}
              disabled={notAddPermission}
              onSubmit={() => {
                navigate('/rubric-edit');
              }}
            >
              Cadastrar Modelo
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
            <FilterRubric
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              setFilterOptionsRubric={setFilterOptionsRubric}
              stateList={stateList}
            />
          </Flex>
        </Flex>
        <TableComponent
          ItemsHeader={itemsHeaderTable}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listRubric.data?.metadata.dataSize === 0}
          isLoading={listRubric.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={
            listRubric.data?.data.map((e: RubricResp) => ({
              items: itemsBodyTable(e),
            })) || []
          }
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listRubric.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
      <DeleteModalComponent
        title="Excluir Modelo"
        subTitle="Tem certeza que deseja excluir esse modelo ?"
        showModal={showDelete}
        setShowModal={() => {
          setShowDelete(false);
        }}
        onSubmit={() => {
          deleteRubric(rubricId).then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'modelo deletado com sucesso',
            });
            setRubricId('');
            listRubric.refetch();
            setShowDelete(false);
          });
        }}
      />
    </>
  );
}
function FilterRubric(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsRubric: React.Dispatch<
    React.SetStateAction<FilterOptionsRubric>
  >;
  stateList: {
    id: string;
    name: string;
  }[];
}) {
  const [name, setName] = React.useState('');
  const [effectiveDate, setEffectiveDate] = React.useState('');
  const [state, setState] = React.useState('');
  function searchFilter() {
    return props.setFilterOptionsRubric({
      effectiveDate: effectiveDate,
      name: name,
      state: state,
    });
  }
  function cleanFilter() {
    return (
      setName(''),
      setEffectiveDate(''),
      setState(''),
      props.setFilterOptionsRubric({ effectiveDate: '', name: '', state: '' })
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
            placeholder="Digite o nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Data de vigência"
            placeholder="Digite a data de vigência"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
          />
          <InputSelectComponent
            defaultValue={state}
            options={props.stateList}
            onChange={(input) => setState(input.target.value)}
            label="Estado"
            placeholder="Selecione o estado"
          />
        </Flex>
      }
    />
  );
}

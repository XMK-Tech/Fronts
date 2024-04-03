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
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import { formatDate } from '../../../utils/functions/formatDate';
import { SortDirection } from '../../../services/PhysicalPersonService';
import {
  IndexResp,
  deleteIndex,
  useIndex,
} from '../../../services/IndexService';
import ModalStructureComponent from '../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../UI/molecules/ContentModalIconComponent/ContentModalIconComponent';
import { useUserData } from '../../../services/LoginService';
import { useNavigate } from 'react-router-dom';
import { DeleteModalComponent } from '../../UI/molecules/DeleteModalComponent/DeleteModalComponent';
import { showToast } from '../../../utils/showToast';
import { useExistsPermission } from '../../../services/PermissionService';

type FilterOptionsIndex = {
  percentage: string;
  reference: string;
  type: string;
};

export default function IndexTemplateComponent() {
  const navigate = useNavigate();
  const toast = useToast();
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const isWeb = useIsWeb();
  const notAddPermission = !useExistsPermission('index', 'add');
  const notEditPermission = !useExistsPermission('index', 'edit');
  const notDeletePermission = !useExistsPermission('index', 'delete');
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('name');
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const [showModalFunctions, setShowModalFunctions] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [indexId, setIndexId] = React.useState('');
  const [filterOptionsIndex, setFilterOptionsIndex] =
    React.useState<FilterOptionsIndex>({
      percentage: '',
      reference: '',
      type: '',
    });
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const user = useUserData();

  const listIndex = useIndex(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsIndex.percentage,
    filterOptionsIndex.reference,
    filterOptionsIndex.type,
    user?.year || ''
  );
  const itemsHeaderTable = [
    { item: 'percentual', sort: 'percentage' },
    { item: 'tipo', sort: 'type' },
    { item: 'Data de publicação', sort: 'reference', hideOnMobile: true },
    { item: 'ações' },
  ];
  const itemsBodyTable = (e: IndexResp) => {
    const mobileColumns = [`${e.percentage} %`, e.typeDescription];

    const buttons = (
      <Flex>
        <IconButtonComponent
          marginX={1}
          arialLabel="Editar"
          toolTipText="Editar"
          disabled={notEditPermission}
          Icon={<FaPencilAlt />}
          onSubmit={() => navigate(`/index-edit/${e.id}`)}
          backgroundColor={'blue.500'}
        />
        <IconButtonComponent
          toolTipText="Excluir"
          arialLabel="Excluir"
          disabled={notDeletePermission}
          Icon={<FaTrash />}
          onSubmit={() => {
            setIndexId(e.id);
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

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Índices</TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar as Índices
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          {isWeb ? (
            <Flex>
              <ButtonComponent
                margin={'0 10px 0 0'}
                disabled={notAddPermission}
                onSubmit={() => navigate('/index-edit')}
              >
                Cadastrar Índice
              </ButtonComponent>
              <ButtonComponent
                disabled
                margin={'0 10px 0 0'}
                onSubmit={() => {}}
              >
                Importar SELIC - Fonte: BCB
              </ButtonComponent>
            </Flex>
          ) : (
            <ButtonComponent
              margin={'0 10px 0 0'}
              onSubmit={() => {
                setShowModalFunctions(true);
              }}
            >
              Funções
            </ButtonComponent>
          )}

          <Flex>
            {isWeb && (
              <SearchComponent
                value={searchInput}
                onClean={() => setSearch('')}
                onChange={(input) => setSearch(input.target.value)}
              />
            )}
            <FilterIndex
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              setFilterOptionsIndex={setFilterOptionsIndex}
            />
          </Flex>
        </Flex>
        <TableComponent
          ItemsHeader={itemsHeaderTable}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listIndex.data?.metadata.dataSize === 0}
          isLoading={listIndex.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={
            listIndex.data?.data.map((e: IndexResp) => ({
              items: itemsBodyTable(e),
            })) || []
          }
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listIndex.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
      <DeleteModalComponent
        title="Excluir Índice"
        subTitle="Tem certeza que deseja excluir esse Índice ?"
        showModal={showDelete}
        setShowModal={() => {
          setShowDelete(false);
        }}
        onSubmit={() => {
          deleteIndex(indexId).then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'índice deletado com sucesso',
            });
            setIndexId('');
            listIndex.refetch();
            setShowDelete(false);
          });
        }}
      />
      <ModalStructureComponent
        size={'xl'}
        title={'Funções'}
        description="funções disponiveis"
        isOpen={showModalFunctions}
        onClose={() => setShowModalFunctions(false)}
        children={
          <ContentModalIconComponent
            secondaryButton={{
              label: 'Fechar',
              onClick: () => setShowModalFunctions(false),
            }}
            body={
              <>
                <ButtonComponent
                  width={'100%'}
                  margin={'0 0 10px 0'}
                  onSubmit={() => navigate('/index-edit')}
                >
                  Cadastrar Índice
                </ButtonComponent>
                <ButtonComponent
                  disabled
                  width={'100%'}
                  margin={'0 0 10px 0'}
                  onSubmit={() => {}}
                >
                  Importar SELIC - Fonte: BCB
                </ButtonComponent>
              </>
            }
          />
        }
      />
    </>
  );
}
function FilterIndex(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsIndex: React.Dispatch<
    React.SetStateAction<FilterOptionsIndex>
  >;
}) {
  const [percentage, setPercentage] = React.useState('');
  const [type, setType] = React.useState('');
  const [reference, setReference] = React.useState('');
  function searchFilter() {
    return props.setFilterOptionsIndex({
      percentage: percentage,
      reference: reference,
      type: type,
    });
  }
  function cleanFilter() {
    return (
      setPercentage(''),
      setType(''),
      setReference(''),
      props.setFilterOptionsIndex({ percentage: '', reference: '', type: '' })
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
            label="Percentual"
            placeholder="Digite o Percentual"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Tipo"
            placeholder="Selecione o tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Data de publicação"
            placeholder="Digite a data de publicação"
            type="date"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </Flex>
      }
    />
  );
}

import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import { Flex, useToast } from '@chakra-ui/react';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import React from 'react';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import {
  ExportType,
  RevenueResp,
  deleteRevenue,
  getRevenueReport,
  useRevenue,
  useRevenueId,
  useTotalRevenue,
} from '../../../services/RevenueService';
import { useIsWeb } from '../../../hooks/useIsWeb';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import { FaInfo, FaPencilAlt, FaTrash } from 'react-icons/fa';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import ModalStructureComponent from '../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../UI/molecules/ContentModalIconComponent/ContentModalIconComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import { formatMonthDate } from '../../../utils/functions/formatDate';
import DetailsComponent from '../../UI/atoms/DetailsComponent/DetailsComponet';
import { SortDirection } from '../../../services/PhysicalPersonService';
import { cleanMoneyMask, moneyMask } from '../../../utils/functions/masks';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../../services/LoginService';
import { dataTotal } from '../../../utils/functions/utility';
import { DeleteModalComponent } from '../../UI/molecules/DeleteModalComponent/DeleteModalComponent';
import { showToast } from '../../../utils/showToast';
import DownloadReportButtonComponent from '../../UI/molecules/DownloadReportButtonComponent/DownloadReportButtonComponent';
import { useExistsPermission } from '../../../services/PermissionService';
import { ImportFpmComponent } from '../../UI/organisms/ImportFPMComponent/ImportFPMComponent';
import { useApiEntities } from '../../../services/EntitiesService';
import { removeAccents } from '../../../utils/StringFormatter';

type FilterOptionsRevenues = {
  account: string;
  description: string;
  reference: string;
  maxEffectedValue: string;
  minEffectedValue: string;
};
export default function RevenuesTemplateComponent() {
  const toast = useToast();
  const [revenueId, setRevenueId] = React.useState('');
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const revenueDatailsID = useRevenueId(revenueId || '');
  const isWeb = useIsWeb();
  const notAddPermission = !useExistsPermission('revenue', 'add');
  const notEditPermission = !useExistsPermission('revenue', 'edit');
  const notDeletePermission = !useExistsPermission('revenue', 'delete');
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('name');
  const [showFilter, setShowFilter] = React.useState(false);
  const [showModalFuncions, setShowModalFunctions] = React.useState(false);
  const [showModalDetails, setShowModalDetails] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [showModalImport, setShowModalImport] = React.useState(false);

  const [filterOptionsRevenue, setFilterOptionsRevenue] =
    React.useState<FilterOptionsRevenues>({
      account: '',
      description: '',
      reference: '',
      maxEffectedValue: '',
      minEffectedValue: '',
    });
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const user = useUserData();

  const municipio = useApiEntities().data?.agiprev.municipioNome || 'Município não encontrado' 
  const cityConfig = removeAccents(municipio.toLowerCase())

  const listRevenue = useRevenue(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsRevenue.account,
    filterOptionsRevenue.description,
    filterOptionsRevenue.reference,
    filterOptionsRevenue.maxEffectedValue,
    filterOptionsRevenue.minEffectedValue,
    user?.year ?? '',
    cityConfig
  );

  const totalRevenue = useTotalRevenue(
    search,
    filterOptionsRevenue.account,
    filterOptionsRevenue.description,
    filterOptionsRevenue.reference,
    filterOptionsRevenue.maxEffectedValue,
    filterOptionsRevenue.minEffectedValue,
    user?.year ?? ''
  );

  const navigate = useNavigate();

  function downloadReport(type: ExportType) {
    return getRevenueReport(
      search,
      sort,
      sortDirection,
      filterOptionsRevenue.account,
      filterOptionsRevenue.description,
      filterOptionsRevenue.reference,
      filterOptionsRevenue.maxEffectedValue,
      filterOptionsRevenue.minEffectedValue,
      user?.year ?? '',
      type
    );
  }

  const itemsBodyTable = (e: RevenueResp) => {
    const mobileColumns = [e.account, e.description];

    const buttons = (
      <Flex>
        <IconButtonComponent
          toolTipText="Detalhes"
          arialLabel="Detalhes"
          Icon={<FaInfo />}
          onSubmit={() => {
            setRevenueId(e.id);
            setShowModalDetails(true);
          }}
          backgroundColor={'purple.500'}
        />
        <IconButtonComponent
          marginX={1}
          arialLabel="Editar"
          toolTipText="Editar"
          disabled={notEditPermission}
          Icon={<FaPencilAlt />}
          onSubmit={() => navigate(`/revenue-edit/${e.id}`)}
          backgroundColor={'blue.500'}
        />
        <IconButtonComponent
          toolTipText="Excluir"
          arialLabel="Excluir"
          disabled={notDeletePermission}
          Icon={<FaTrash />}
          onSubmit={() => {
            setRevenueId(e.id);
            setShowDelete(true);
          }}
        />
      </Flex>
    );

    if (!isWeb) {
      return [...mobileColumns, buttons];
    }
    return [
      ...mobileColumns,
      `${formatMonthDate(e.reference)}`,
      moneyMask(String(e.effectedValue)),
      buttons,
    ];
  };

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Receitas</TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar a lista de Receitas cadastradas
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          {isWeb ? (
            <Flex>
              <ButtonComponent
                margin={'0 10px 0 0'}
                disabled={notAddPermission}
                onSubmit={() => navigate('/revenue-edit')}
              >
                Cadastrar Receita
              </ButtonComponent>
              <ButtonComponent
                margin={'0 10px 0 0'}
                onSubmit={() => {
                  setShowModalImport(true);
                }}
              >
                Importar Receita
              </ButtonComponent>
              <ButtonComponent
                margin={'0 10px 0 0'}
                onSubmit={() => {
                  navigate('/fpm');
                }}
              >
                Visualizar Demonstrativos do Banco do Brasil
              </ButtonComponent>
              <DownloadReportButtonComponent
                width={' '}
                m={'0 10px 0 0'}
                downloadReport={(type) => downloadReport(type)}
              />
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
          {
            <Flex>
              {isWeb && (
                <SearchComponent
                  value={searchInput}
                  onClean={() => setSearch('')}
                  onChange={(input) => setSearch(input.target.value)}
                />
              )}
              <FilterRevenues
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                setFilterOptionsRevenue={setFilterOptionsRevenue}
              />
            </Flex>
          }
        </Flex>

        <TableComponent
          ItemsHeader={[
            { item: 'Conta', sort: 'account' },
            { item: 'receita', sort: 'description' },
            { item: 'competência', hideOnMobile: true },
            { item: 'total', sort: 'effectedvalue', hideOnMobile: true },
            { item: 'ações' },
          ]}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listRevenue.data?.metadata.dataSize === 0}
          isLoading={listRevenue.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={dataTotal(
            listRevenue.data?.data?.map((e: RevenueResp) => ({
              items: itemsBodyTable(e),
            })) ?? [],
            totalRevenue.data?.data.sum || 0
          )}
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listRevenue.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
      <DeleteModalComponent
        title="Excluir Receita"
        subTitle="Tem certeza que deseja excluir essa receita ?"
        showModal={showDelete}
        setShowModal={() => {
          setShowDelete(false);
        }}
        onSubmit={() => {
          deleteRevenue(revenueId).then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'receita deletada com sucesso',
            });
            setRevenueId('');
            listRevenue.refetch();
            setShowDelete(false);
          });
        }}
      />
      <ImportFpmComponent
        type="revenue"
        isOpen={showModalImport}
        onClose={() => {
          setShowModalImport(false);
          listRevenue.refetch();
        }}
      />
      <ModalStructureComponent
        size={'xl'}
        title={'Funções'}
        description="funções disponiveis"
        isOpen={showModalFuncions}
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
                  width="100%"
                  margin={'0 0 10px 0'}
                  onSubmit={() => navigate('/revenue-edit')}
                >
                  Cadastrar Receita
                </ButtonComponent>
                <ButtonComponent
                  width="100%"
                  margin={'0 0 10px 0'}
                  onSubmit={() => {}}
                  disabled
                >
                  Importa Receita
                </ButtonComponent>
                <ButtonComponent
                  width="100%"
                  margin={'0 0 10px 0'}
                  onSubmit={() => {}}
                  disabled
                >
                  Visualizar Demonstrativos do Banco do Brasil
                </ButtonComponent>
                <DownloadReportButtonComponent
                  width="100%"
                  m={'0 0 10px 0'}
                  downloadReport={(type) => downloadReport(type)}
                />
              </>
            }
          />
        }
      />
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
                  label="Conta"
                  value={revenueDatailsID.data?.account}
                />
                <DetailsComponent
                  label="Receita"
                  value={revenueDatailsID.data?.description}
                />
                <DetailsComponent
                  label="Competência"
                  value={`${formatMonthDate(revenueDatailsID.data?.reference)}`}
                />
                <DetailsComponent
                  label="Total"
                  value={moneyMask(
                    String(revenueDatailsID.data?.effectedValue)
                  )}
                />
              </>
            }
          />
        }
      />
    </>
  );
}
function FilterRevenues(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsRevenue: React.Dispatch<
    React.SetStateAction<FilterOptionsRevenues>
  >;
}) {
  const [account, setAccount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [reference, setReference] = React.useState('');
  const [maxValue, setMaxValue] = React.useState('');
  const [minValue, setMinValue] = React.useState('');

  function searchFilter() {
    return props.setFilterOptionsRevenue({
      account: account,
      description: description,
      reference: reference,
      maxEffectedValue: String(cleanMoneyMask(maxValue)),
      minEffectedValue: String(cleanMoneyMask(minValue)),
    });
  }
  function cleanFilter() {
    return (
      setAccount(''),
      setDescription(''),
      setReference(''),
      setMaxValue(''),
      setMinValue(''),
      props.setFilterOptionsRevenue({
        account: '',
        description: '',
        reference: '',
        maxEffectedValue: '',
        minEffectedValue: '',
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
            label="Conta"
            placeholder="Digite a Conta"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Receita "
            placeholder="Digite a Receita"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            type="month"
            label="Competência"
            placeholder="Digite a competência"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <Flex margin={'10px 0 10px 0'} width={'100%'}>
            <InputComponent
              marginRight={4}
              placeholder="min"
              label={'Valor Mínimo Total'}
              value={minValue}
              onChange={(e) => setMinValue(moneyMask(e.target.value, true))}
            />
            <InputComponent
              marginLeft={4}
              placeholder="max"
              label={'Valor Máximo Total'}
              value={maxValue}
              onChange={(e) => setMaxValue(moneyMask(e.target.value, true))}
            />
          </Flex>
        </Flex>
      }
    />
  );
}

import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import { Flex, SkeletonText, useToast } from '@chakra-ui/react';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import React from 'react';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { useIsWeb } from '../../../hooks/useIsWeb';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import { FaInfo, FaPaperclip, FaPencilAlt, FaTrash } from 'react-icons/fa';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import {
  formatDate,
  formatDateAndHour,
  formatMonthDate,
} from '../../../utils/functions/formatDate';
import { SortDirection } from '../../../services/PhysicalPersonService';
import ModalStructureComponent from '../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../UI/molecules/ContentModalIconComponent/ContentModalIconComponent';
import DetailsComponent from '../../UI/atoms/DetailsComponent/DetailsComponet';
import {
  ExpenseResp,
  deleteExpense,
  expenseTypeOptions,
  getExpenseReport,
  useExpense,
  useExpenseDetails,
  useTotalExpense,
} from '../../../services/ExpenseService';
import ArchiveDetailsComponent from '../../UI/molecules/ArchiveDetailsComponent/ArchiveDetailsComponent';
import { AttachExpenseModalComponent } from '../../UI/organisms/AttachExpenseModalComponent/AttachExpenseModalComponent';
import { cleanMoneyMask, moneyMask } from '../../../utils/functions/masks';
import { useUserData } from '../../../services/LoginService';
import { useNavigate } from 'react-router-dom';
import { dataTotal } from '../../../utils/functions/utility';
import { DeleteModalComponent } from '../../UI/molecules/DeleteModalComponent/DeleteModalComponent';
import { showToast } from '../../../utils/showToast';
import { ExportType } from '../../../services/RevenueService';
import DownloadReportButtonComponent from '../../UI/molecules/DownloadReportButtonComponent/DownloadReportButtonComponent';
import { useExistsPermission } from '../../../services/PermissionService';
import { ImportFpmComponent } from '../../UI/organisms/ImportFPMComponent/ImportFPMComponent';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import { useApiEntities } from '../../../services/EntitiesService';
import { removeAccents } from '../../../utils/StringFormatter';

type FilterOptionsExpense = {
  type: string;
  pasep: string;
  description: string;
  maxValue: string;
  minValue: string;
  reference: string;
};

export default function ExpenseTemplateComponent() {
  const navigate = useNavigate();
  const toast = useToast();
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const isWeb = useIsWeb();
  const notAddPermission = !useExistsPermission('expense', 'add');
  const notEditPermission = !useExistsPermission('expense', 'edit');
  const notDeletePermission = !useExistsPermission('expense', 'delete');
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [expenseId, setExpenseId] = React.useState('');
  const expenseDatailsID = useExpenseDetails(expenseId);
  const [sort, setSort] = React.useState<string>('createdAt');
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const [showModalFunctions, setShowModalFunctions] = React.useState(false);
  const [showModalDetails, setShowModalDetails] = React.useState(false);
  const [showModalAttachments, setShowModalAttachments] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [showModalImport, setShowModalImport] = React.useState(false);
  const [FilterOptionsExpense, setFilterOptionsExpense] =
    React.useState<FilterOptionsExpense>({
      type: '',
      pasep: '',
      description: '',
      maxValue: '',
      minValue: '',
      reference: '',
    });
  const archives = expenseDatailsID.data?.attachments;

  /* const ipmUrl = useApiEntities().data?.agiprev.ipmUrl || '';
  const regexMatch = ipmUrl.match(/https:\/\/(.*?)\./);
  const cityConfig = regexMatch ? regexMatch[1] : 'Município não encontrado'; 
  console.log(cityConfig) */
  
  const municipio = useApiEntities().data?.agiprev.municipioNome || 'Município não encontrado' 
  const cityConfig = removeAccents(municipio.toLowerCase())
  // console.log(cityConfig)

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }

  const user = useUserData();

  const Buttons = (
    <Flex flexDirection={isWeb ? 'row' : 'column'}>
      <ButtonComponent
        margin={'0 10px 0 0'}
        disabled={notAddPermission}
        onSubmit={() => navigate('/expense-edit')}
      >
        Cadastrar Despesa
      </ButtonComponent>
      <ButtonComponent
        width={isWeb ? '' : '100%'}
        margin={isWeb ? '0 10px 0 0' : '0 0 10px 0'}
        disabled
        onSubmit={() => {}}
      >
        Efetuar lançamento
      </ButtonComponent>
      <DownloadReportButtonComponent
        downloadReport={(type) => downloadReport(type)}
      />
      <ButtonComponent
        width={isWeb ? '' : '100%'}
        margin={isWeb ? '0 10px 0 0' : '0 0 10px 0'}
        onSubmit={() => {
          setShowModalImport(true);
        }}
      >
        Importar Despesas
      </ButtonComponent>
    </Flex>
  );

  const listExpense = useExpense(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    FilterOptionsExpense.type,
    FilterOptionsExpense.pasep,
    FilterOptionsExpense.description,
    FilterOptionsExpense.maxValue,
    FilterOptionsExpense.minValue,
    FilterOptionsExpense.reference,
    user?.year ?? '',
    cityConfig
  );
  const totalExpense = useTotalExpense(
    search,
    FilterOptionsExpense.type,
    FilterOptionsExpense.pasep,
    FilterOptionsExpense.description,
    FilterOptionsExpense.maxValue,
    FilterOptionsExpense.minValue,
    FilterOptionsExpense.reference,
    user?.year ?? ''
  );

  function downloadReport(exportType: ExportType) {
    return getExpenseReport(
      search,
      sort,
      sortDirection,
      FilterOptionsExpense.type,
      FilterOptionsExpense.pasep,
      FilterOptionsExpense.description,
      FilterOptionsExpense.maxValue,
      FilterOptionsExpense.minValue,
      FilterOptionsExpense.reference,
      user?.year ?? '',
      exportType
    );
  }

  const itemsHeaderTable = [
    { item: 'Tipo de despesa', sort: 'type' },
    { item: 'Empenho', sort: 'pasep' },
    { item: 'Credor', sort: 'description', hideOnMobile: true },
    { item: 'Data', sort: 'reference', hideOnMobile: true },
    { item: 'Competência', sort: 'reference', hideOnMobile: true },
    { item: 'Valor Pago', sort: 'value', hideOnMobile: true },
    { item: 'ações' },
  ];
  function itemsBodyTable(e: ExpenseResp, i: number) {
    const mobileColumns = [e.typeDescription, e.pasep];

    const buttons = (
      <Flex key={i}>
        <IconButtonComponent
          arialLabel="Detalhes"
          toolTipText="Detalhes"
          Icon={<FaInfo />}
          onSubmit={() => {
            setExpenseId(e.id);
            setShowModalDetails(true);
          }}
          colorScheme="purple"
        />
        <IconButtonComponent
          marginX={1}
          arialLabel="Editar"
          toolTipText="Editar"
          disabled={notEditPermission}
          Icon={<FaPencilAlt />}
          onSubmit={() => {
            navigate(`/expense-edit/${e.id}`);
          }}
          colorScheme="blue"
        />
        <IconButtonComponent
          toolTipText="Anexar Documentos"
          arialLabel="Anexar Documentos"
          disabled={notEditPermission}
          Icon={<FaPaperclip />}
          onSubmit={() => {
            setExpenseId(e.id);
            setShowModalAttachments(true);
          }}
          colorScheme="green"
        />
        <IconButtonComponent
          marginX={1}
          toolTipText="Excluir"
          arialLabel="Excluir"
          disabled={notDeletePermission}
          Icon={<FaTrash />}
          onSubmit={() => {
            setExpenseId(e.id);
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
      e.description,
      formatDate(e.reference),
      formatMonthDate(e.reference),
      moneyMask(e.value?.toString()),
      buttons,
    ];
  }
  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Despesas</TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar as Despesas
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          {isWeb ? (
            Buttons
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
            <FilterExpense
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              setFilterOptionsExpense={setFilterOptionsExpense}
            />
          </Flex>
        </Flex>
        <TableComponent
          ItemsHeader={itemsHeaderTable}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listExpense.data?.metadata.dataSize === 0}
          isLoading={listExpense.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={dataTotal(
            listExpense.data?.data?.map((e, i) => ({
              items: itemsBodyTable(e, i),
            })) ?? [],
            totalExpense.data?.data.sum || 0
          )}
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listExpense.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
      <DeleteModalComponent
        title="Excluir Despesa"
        subTitle="Tem certeza que deseja excluir essa despesa ?"
        showModal={showDelete}
        setShowModal={() => {
          setShowDelete(false);
        }}
        onSubmit={() => {
          deleteExpense(expenseId).then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'despesa deletada com sucesso',
            });
            setExpenseId('');
            listExpense.refetch();
            setShowDelete(false);
          });
        }}
      />
      <ImportFpmComponent
        type="expense"
        isOpen={showModalImport}
        onClose={() => {
          setShowModalImport(false);
          listExpense.refetch();
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
            body={Buttons}
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
              expenseDatailsID.isLoading ? (
                <SkeletonText
                  mt="4"
                  noOfLines={10}
                  spacing="4"
                  skeletonHeight="8"
                />
              ) : (
                <>
                  <DetailsComponent
                    label="id"
                    value={expenseDatailsID.data?.id}
                  />
                  <DetailsComponent
                    label="Competência"
                    value={formatMonthDate(expenseDatailsID.data?.reference)}
                  />
                  <DetailsComponent
                    label="Valor total recolhido PASEP"
                    value={expenseDatailsID.data?.pasep}
                  />

                  <DetailsComponent
                    label="Valor total"
                    value={expenseDatailsID.data?.value}
                  />
                  <TitleTextComponent mb={4}>
                    Arquivos Anexados
                  </TitleTextComponent>
                  {archives?.length === 0 ? (
                    <TitleTextComponent subTitle>
                      Ainda não foram anexados arquivos{' '}
                    </TitleTextComponent>
                  ) : (
                    <>
                      {archives?.map((e) => (
                        <>
                          <DetailsComponent
                            label="observações"
                            value={e.description}
                          />
                          <ArchiveDetailsComponent
                            linkDowload={true}
                            title={e?.typeDescription || ''}
                            subTitle={formatDateAndHour(e.createdAt)}
                            archive={e.attachment?.displayName}
                            typeArchive={e.attachment?.type}
                          />
                        </>
                      ))}
                    </>
                  )}
                </>
              )
            }
          />
        }
      />
      <AttachExpenseModalComponent
        showModal={showModalAttachments}
        setShowModal={() => setShowModalAttachments(false)}
        selectedExpenseId={expenseId}
        reloadData={() => listExpense.refetch()}
      />
    </>
  );
}
function FilterExpense(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsExpense: React.Dispatch<
    React.SetStateAction<FilterOptionsExpense>
  >;
}) {
  const [type, setType] = React.useState('');
  const [pasep, setPasep] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [maxValue, setMaxValue] = React.useState('');
  const [minValue, setMinValue] = React.useState('');
  const [reference, setReference] = React.useState('');
  function searchFilter() {
    return props.setFilterOptionsExpense({
      type: type,
      pasep: pasep,
      description: description,
      maxValue: String(cleanMoneyMask(maxValue)),
      minValue: String(cleanMoneyMask(minValue)),
      reference: reference,
    });
  }
  function cleanFilter() {
    return (
      setType(''),
      setPasep(''),
      setDescription(''),
      setMaxValue(''),
      setMinValue(''),
      setReference(''),
      props.setFilterOptionsExpense({
        type: '',
        pasep: '',
        description: '',
        maxValue: '',
        minValue: '',
        reference: '',
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
          <InputSelectComponent
            m={'10px 0 10px 0'}
            defaultValue={type}
            options={expenseTypeOptions}
            onChange={(input) => setType(input.target.value)}
            label="Tipo"
            placeholder="Selecione o tipo"
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Empenho"
            placeholder="Digite o empenho"
            value={pasep}
            onChange={(e) => setPasep(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Credor"
            placeholder="Digite o credor"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <InputComponent
            margin={'10px 0 10px 0'}
            type="month"
            label="Competência"
            placeholder="Digite a Competência"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </Flex>
      }
    />
  );
}

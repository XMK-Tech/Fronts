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
import { SortDirection } from '../../../services/PhysicalPersonService';
import ModalStructureComponent from '../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../UI/molecules/ContentModalIconComponent/ContentModalIconComponent';
import {
  CollectionResp,
  deleteCollection,
  getCollectionReport,
  useCollection,
  useCollectionId,
  useTotalCollection,
} from '../../../services/CollectionService';
import DetailsComponent from '../../UI/atoms/DetailsComponent/DetailsComponet';
import {
  formatDate,
  formatDateAndHour,
  formatMonthDate,
} from '../../../utils/functions/formatDate';
import ArchiveDetailsComponent from '../../UI/molecules/ArchiveDetailsComponent/ArchiveDetailsComponent';
import { cleanMoneyMask, moneyMask } from '../../../utils/functions/masks';
import { AttachCollectionModalComponent } from '../../UI/organisms/AttachCollectionModalComponent/AttachCollectionModalComponent';

import { useUserData } from '../../../services/LoginService';
import { useNavigate } from 'react-router-dom';
import { dataTotal } from '../../../utils/functions/utility';
import { DeleteModalComponent } from '../../UI/molecules/DeleteModalComponent/DeleteModalComponent';
import { showToast } from '../../../utils/showToast';
import { ExportType } from '../../../services/RevenueService';
import DownloadReportButtonComponent from '../../UI/molecules/DownloadReportButtonComponent/DownloadReportButtonComponent';
import { useExistsPermission } from '../../../services/PermissionService';
import { ImportFpmComponent } from '../../UI/organisms/ImportFPMComponent/ImportFPMComponent';
import { useApiEntities } from '../../../services/EntitiesService';
import { removeAccents } from '../../../utils/StringFormatter';

type FilterOptionsCollection = {
  reference: string;
  payday: string;
  maxPasepValue: string;
  minPasepValue: string;
  maxSelicValue: string;
  minSelicValue: string;
};

export default function CollectionTemplateComponent() {
  const toast = useToast();
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const isWeb = useIsWeb();
  const notAddPermission = !useExistsPermission('collection', 'add');
  const notEditPermission = !useExistsPermission('collection', 'edit');
  const notDeletePermission = !useExistsPermission('collection', 'delete');
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [collectionId, setCollectionId] = React.useState('');
  const collectionDetailsID = useCollectionId(collectionId);
  const [sort, setSort] = React.useState<string>('createdAt');
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const [showModalFunctions, setShowModalFunctions] = React.useState(false);
  const [showModalDetails, setShowModalDetails] = React.useState(false);
  const [showModalImport, setShowModalImport] = React.useState(false);
  const [showModalAttachments, setShowModalAttachments] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [filterOptionsCollection, setFilterOptionsCollection] =
    React.useState<FilterOptionsCollection>({
      reference: '',
      payday: '',
      maxPasepValue: '',
      minPasepValue: '',
      maxSelicValue: '',
      minSelicValue: '',
    });
  const archives = collectionDetailsID.data?.attachments;
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }

  const user = useUserData();
  const navigate = useNavigate();

  const Buttons = (
    <Flex flexDirection={isWeb ? 'row' : 'column'}>
      <ButtonComponent
        width={isWeb ? '' : '100%'}
        margin={isWeb ? '0 10px 0 0' : '0 0 10px 0'}
        disabled={notAddPermission}
        onSubmit={() => {
          navigate('/collection-register');
        }}
      >
        Efetuar lançamento
      </ButtonComponent>
      <DownloadReportButtonComponent
        downloadReport={(type) => downloadReport(type)}
      />
      <ButtonComponent
        width={isWeb ? '' : '100%'}
        margin={isWeb ? '0 10px 0 0' : '0 0 10px 0'}
        onSubmit={() => setShowModalImport(true)}
      >
        Importar Recolhimento
      </ButtonComponent>
    </Flex>
  );

  const municipio = useApiEntities().data?.agiprev.municipioNome || 'Município não encontrado' 
  const cityConfig = municipio.toLowerCase() 

  const listCollection = useCollection(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsCollection.reference,
    filterOptionsCollection.payday,
    filterOptionsCollection.maxPasepValue,
    filterOptionsCollection.minPasepValue,
    filterOptionsCollection.maxSelicValue,
    filterOptionsCollection.minSelicValue,
    user?.year ?? '',
    cityConfig
  );
  const totalCollection = useTotalCollection(
    search,
    filterOptionsCollection.reference,
    filterOptionsCollection.payday,
    filterOptionsCollection.maxPasepValue,
    filterOptionsCollection.minPasepValue,
    filterOptionsCollection.maxSelicValue,
    filterOptionsCollection.minSelicValue,
    user?.year ?? ''
  );

  function downloadReport(type: ExportType) {
    return getCollectionReport(
      sort,
      sortDirection,
      filterOptionsCollection.reference,
      filterOptionsCollection.payday,
      filterOptionsCollection.maxPasepValue,
      filterOptionsCollection.minPasepValue,
      filterOptionsCollection.maxSelicValue,
      filterOptionsCollection.minSelicValue,
      user?.year ?? '',
      type
    );
  }

  const itemsHeaderTable = [
    { item: 'competência', sort: 'reference' },
    { item: 'pagamento', sort: 'payday' },
    { item: 'valor principal', sort: 'selicValue', hideOnMobile: true },
    {
      item: 'valor total recolhido pasep',
      sort: 'pasepValue',
      hideOnMobile: true,
    },
    { item: 'ações' },
  ];

  function itemsBodyTable(e: CollectionResp, i: number) {
    const mobileColumns = [formatMonthDate(e.reference), formatDate(e.payday)];

    const buttons = (
      <Flex key={i}>
        <IconButtonComponent
          arialLabel="Detalhes"
          toolTipText="Detalhes"
          Icon={<FaInfo />}
          onSubmit={() => {
            setCollectionId(e.id);
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
          onSubmit={() => {
            navigate(`/collection-edit/${e.id}`);
          }}
          backgroundColor={'blue.500'}
        />
        <IconButtonComponent
          toolTipText="Anexar Documentos"
          arialLabel="Anexar Documentos"
          disabled={notEditPermission}
          Icon={<FaPaperclip />}
          onSubmit={() => {
            setCollectionId(e.id);
            setShowModalAttachments(true);
          }}
          backgroundColor={'green.500'}
        />
        <IconButtonComponent
          marginX={1}
          toolTipText="Excluir"
          arialLabel="Excluir"
          disabled={notDeletePermission}
          Icon={<FaTrash />}
          onSubmit={() => {
            setCollectionId(e.id);
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
      moneyMask(e.selicValue?.toString()),
      moneyMask(e.pasepValue?.toString()),
      buttons,
    ];
  }

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Recolhimento </TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar os Recolhimento
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
            <FilterCollection
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              setFilterOptionsCollection={setFilterOptionsCollection}
            />
          </Flex>
        </Flex>
        <TableComponent
          ItemsHeader={itemsHeaderTable}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listCollection.data?.metadata.dataSize === 0}
          isLoading={listCollection.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={dataTotal(
            listCollection.data?.data?.map((e, i) => ({
              items: itemsBodyTable(e, i),
            })) ?? [],
            totalCollection.data?.data.sum || 0
          )}
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listCollection.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
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
      <ImportFpmComponent
        type="collection"
        isOpen={showModalImport}
        onClose={() => {
          setShowModalImport(false);
          listCollection.refetch();
        }}
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
              collectionDetailsID.isLoading ? (
                <SkeletonText
                  mt="4"
                  noOfLines={10}
                  spacing="4"
                  skeletonHeight="8"
                />
              ) : (
                <>
                  <DetailsComponent
                    label="Competência"
                    value={formatMonthDate(collectionDetailsID.data?.reference)}
                  />
                  <DetailsComponent
                    label="Data de pagamento"
                    value={formatDate(collectionDetailsID.data?.payday)}
                  />
                  <DetailsComponent
                    label="Valor total recolhido PASEP"
                    value={moneyMask(
                      collectionDetailsID.data?.pasepValue?.toString()
                    )}
                  />
                  <DetailsComponent
                    label="Valor Principal"
                    value={moneyMask(
                      collectionDetailsID.data?.selicValue?.toString()
                    )}
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
                      {archives?.map((e, i) => (
                        <ArchiveDetailsComponent
                          key={i}
                          linkDowload={true}
                          title={e?.typeDescription || ''}
                          subTitle={formatDateAndHour(e.createdAt)}
                          archive={e.attachment?.displayName}
                          typeArchive={e.attachment?.type}
                        />
                      ))}
                    </>
                  )}
                </>
              )
            }
          />
        }
      />

      <DeleteModalComponent
        title="Excluir Recolhimento"
        subTitle="Tem certeza que deseja excluir esse Recolhimento ?"
        showModal={showDelete}
        setShowModal={() => {
          setShowDelete(false);
        }}
        onSubmit={() => {
          deleteCollection(collectionId).then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'recolhimento deletado com sucesso',
            });
            setCollectionId('');
            listCollection.refetch();
            setShowDelete(false);
          });
        }}
      />
      <AttachCollectionModalComponent
        showModal={showModalAttachments}
        setShowModal={() => setShowModalAttachments(false)}
        selectedCollectionId={collectionId}
        reloadData={() => listCollection.refetch()}
      />
    </>
  );
}
function FilterCollection(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsCollection: React.Dispatch<
    React.SetStateAction<FilterOptionsCollection>
  >;
}) {
  const [competence, setCompetence] = React.useState('');
  const [payday, setPayday] = React.useState('');
  const [maxPasepValue, setMaxPasepValue] = React.useState('');
  const [minPasepValue, setMinPasepValue] = React.useState('');
  const [maxSelicValue, setMaxSelicValue] = React.useState('');
  const [minSelicValue, setMinSelicValue] = React.useState('');
  function searchFilter() {
    return props.setFilterOptionsCollection({
      reference: competence,
      payday: payday,
      maxPasepValue: String(cleanMoneyMask(maxPasepValue)),
      minPasepValue: String(cleanMoneyMask(minPasepValue)),
      maxSelicValue: String(cleanMoneyMask(maxSelicValue)),
      minSelicValue: String(cleanMoneyMask(minSelicValue)),
    });
  }
  function cleanFilter() {
    return (
      setCompetence(''),
      setPayday(''),
      setMaxPasepValue(''),
      setMinPasepValue(''),
      setMaxSelicValue(''),
      setMinSelicValue(''),
      props.setFilterOptionsCollection({
        payday: '',
        reference: '',
        maxPasepValue: '',
        minPasepValue: '',
        maxSelicValue: '',
        minSelicValue: '',
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
            label="Competência"
            placeholder="Digite a Competência"
            type="month"
            value={competence}
            onChange={(e) => setCompetence(e.target.value)}
          />
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Data de Pagamento"
            placeholder="Digite a data de Pagamento"
            type="date"
            value={payday}
            onChange={(e) => setPayday(e.target.value)}
          />
          <Flex margin={'10px 0 10px 0'} width={'100%'}>
            <InputComponent
              marginRight={4}
              placeholder="min"
              label={'Valor Mínimo total PASEP'}
              value={minPasepValue}
              onChange={(e) =>
                setMinPasepValue(moneyMask(e.target.value, true))
              }
            />
            <InputComponent
              marginLeft={4}
              placeholder="max"
              label={'Valor Máximo total PASEP'}
              value={maxPasepValue}
              onChange={(e) =>
                setMaxPasepValue(moneyMask(e.target.value, true))
              }
            />
          </Flex>
          <Flex margin={'10px 0 10px 0'} width={'100%'}>
            <InputComponent
              marginRight={4}
              placeholder="min"
              label={'Valor Mínimo Selic'}
              value={minSelicValue}
              onChange={(e) =>
                setMinSelicValue(moneyMask(e.target.value, true))
              }
            />
            <InputComponent
              marginLeft={4}
              placeholder="max"
              label={'Valor Máximo Selic'}
              value={maxSelicValue}
              onChange={(e) =>
                setMaxSelicValue(moneyMask(e.target.value, true))
              }
            />
          </Flex>
        </Flex>
      }
    />
  );
}

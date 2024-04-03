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
import { FaInfo, FaPencilAlt, FaTrash } from 'react-icons/fa';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import ModalStructureComponent from '../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../UI/molecules/ContentModalIconComponent/ContentModalIconComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import DetailsComponent from '../../UI/atoms/DetailsComponent/DetailsComponet';
import { SortDirection } from '../../../services/PhysicalPersonService';
import {
  EntitiesResp,
  useEntitiesDetails,
} from '../../../services/EntitiesService';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../../services/LoginService';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import { cnpjMask } from '../../../utils/functions/masks';
import {
  deleteRelatedEntity,
  relatedEntityTypeOptions,
  useRelatedEntity,
  useRelatedEntityId,
} from '../../../services/RelatedEntitiesService';
import { DeleteModalComponent } from '../../UI/molecules/DeleteModalComponent/DeleteModalComponent';
import { showToast } from '../../../utils/showToast';
import { useExistsPermission } from '../../../services/PermissionService';

type FilterOptionsEntities = {
  name: string;
  document: string;
  type: string;
  responsibleDocument: string;
};
export default function RelatedEntityTemplateComponent() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useUserData();
  const detailsEntity = useEntitiesDetails(user?.entity);
  const [entitieId, setEntitieId] = React.useState('');
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const relatedEntityDetails = useRelatedEntityId(entitieId || '');
  const isWeb = useIsWeb();
  const notAddPermission = !useExistsPermission('relatedentity', 'add');
  const notEditPermission = !useExistsPermission('relatedentity', 'edit');
  const notDeletePermission = !useExistsPermission('relatedentity', 'delete');
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('name');
  const [showFilter, setShowFilter] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [showModalDetails, setShowModalDetails] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const [filterOptionsEntities, setFilterOptionsEntities] =
    React.useState<FilterOptionsEntities>({
      document: '',
      name: '',
      type: '',
      responsibleDocument: '',
    });
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }

  const listEntities = useRelatedEntity(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsEntities.name,
    filterOptionsEntities.document,
    filterOptionsEntities.type
  );

  const itemsBodyTable = (e: EntitiesResp) => {
    const mobileColumns = [e.name, cnpjMask(e.document)];

    const buttons = (
      <Flex>
        <IconButtonComponent
          toolTipText="Detalhes"
          arialLabel="Detalhes"
          Icon={<FaInfo />}
          onSubmit={() => {
            setEntitieId(e.id);
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
            navigate(`/entities-edit/${e.id}`);
          }}
          backgroundColor={'blue.500'}
        />
        <IconButtonComponent
          toolTipText="Excluir"
          arialLabel="Excluir"
          disabled={notDeletePermission}
          Icon={<FaTrash />}
          onSubmit={() => {
            setEntitieId(e.id);
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
      e.typeDescription,
      cnpjMask(detailsEntity.data?.document),
      buttons,
    ];
  };

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Entidades</TitleTextComponent>
        <TitleTextComponent subTitle>
          {`${detailsEntity.data?.name} - ${detailsEntity.data?.document}`}
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          <Flex>
            <ButtonComponent
              margin={'0 10px 0 0'}
              disabled={notAddPermission}
              onSubmit={() => {
                navigate(`/entities-edit`);
              }}
            >
              Cadastrar Entidade
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
              <FilterEntitites
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                setFilterOptionsEntities={setFilterOptionsEntities}
              />
            </Flex>
          }
        </Flex>

        <TableComponent
          centered
          ItemsHeader={[
            { item: 'nome', sort: 'Name' },
            { item: 'CNPJ', sort: 'Document' },
            { item: 'tipo de entidade', sort: 'Type', hideOnMobile: true },
            {
              item: 'cnpj-vinculado',
              sort: 'ResponsibleDocument',
              hideOnMobile: true,
            },
            { item: 'ações' },
          ]}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listEntities.data?.metadata.dataSize === 0}
          isLoading={listEntities.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={
            listEntities.data?.data.map((e: EntitiesResp) => ({
              items: itemsBodyTable(e),
            })) || []
          }
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listEntities.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
      <DeleteModalComponent
        title="Excluir Entidade"
        subTitle="Tem certeza que deseja excluir essa entidade ?"
        showModal={showDelete}
        setShowModal={() => {
          setShowDelete(false);
        }}
        onSubmit={() => {
          deleteRelatedEntity(entitieId).then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'entidade deletada com sucesso',
            });
            setEntitieId('');
            listEntities.refetch();
            setShowDelete(false);
          });
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
              <>
                <DetailsComponent
                  label="Nome"
                  value={relatedEntityDetails.data?.name}
                />
                <DetailsComponent
                  label="CNPJ"
                  value={relatedEntityDetails.data?.document}
                />
                <DetailsComponent
                  label="Tipo de Entidade"
                  value={relatedEntityDetails.data?.typeDescription}
                />
              </>
            }
          />
        }
      />
    </>
  );
}

function FilterEntitites(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsEntities: React.Dispatch<
    React.SetStateAction<FilterOptionsEntities>
  >;
}) {
  const [name, setName] = React.useState('');
  const [document, setDocument] = React.useState('');
  const [type, setType] = React.useState('');
  const [responsibleDocument, setResponsibleDocument] = React.useState('');
  function searchFilter() {
    return props.setFilterOptionsEntities({
      document: document,
      name: name,
      responsibleDocument: responsibleDocument,
      type: type,
    });
  }
  function cleanFilter() {
    return (
      setName(''),
      setDocument(''),
      setType(''),
      setResponsibleDocument(''),
      props.setFilterOptionsEntities({
        document: '',
        name: '',
        responsibleDocument: '',
        type: '',
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
            label="CNPJ "
            placeholder="Digite o CNPJ "
            value={document}
            onChange={(e) => setDocument(cnpjMask(e.target.value))}
          />
          <InputSelectComponent
            m={'10px 0 10px 0'}
            defaultValue={type}
            options={relatedEntityTypeOptions}
            onChange={(input) => setType(input.target.value)}
            label="Tipo"
            placeholder="Selecione o tipo"
          />
        </Flex>
      }
    />
  );
}

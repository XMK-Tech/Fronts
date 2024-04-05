import { Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FPMLaunchResp,
  useFPMLaunch,
  useFPMLaunchDetails,
} from '../../../services/FPMLaunchService';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import { FaInfo, FaPencilAlt, FaTrash, FaCheck } from 'react-icons/fa';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import { useState } from 'react';
import { SortDirection } from '../../../services/PhysicalPersonService';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import { useIsWeb } from '../../../hooks/useIsWeb';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { moneyMask } from '../../../utils/functions/masks';
import { useDebounce } from '../../../utils/functions/debounce';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import ModalStructureComponent from '../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../UI/molecules/ContentModalIconComponent/ContentModalIconComponent';
import DetailsComponent from '../../UI/atoms/DetailsComponent/DetailsComponet';
import { useUserData } from '../../../services/LoginService';
import {
  formatDate,
  formatMonthDate,
} from '../../../utils/functions/formatDate';
import { ImportFpmComponent } from '../../UI/organisms/ImportFPMComponent/ImportFPMComponent';
import { useApiEntities } from '../../../services/EntitiesService';
import { capitalizeFirstLetter, removeAccents } from '../../../utils/StringFormatter';

type FilterOptionsFpm = {
  description: string;
  incomeAccount: string;
  competence: string;
  minReference: string;
  maxReference: string;
  minCollected: string;
  maxCollected: string;
  minAccumulated: string;
  maxAccumulated: string;
};

export default function FPMLaunchTemplateComponent() {

  const navigate = useNavigate();
  const isWeb = useIsWeb();

  /* const ipmUrl = useApiEntities().data?.agiprev.ipmUrl || '';
  const regexMatch = ipmUrl.match(/https:\/\/(.*?)\./);
  const cityConfig = regexMatch ? regexMatch[1] : 'Município não encontrado'; */

  const municipio = useApiEntities().data?.agiprev.municipioNome || 'Município não encontrado' 
  const cityConfig = municipio.toLowerCase() 

  const { pageSize, selectedPage, setSelectedPage } = usePagination();

  const [searchInput, search, setSearch] = useDebounce('');
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const user = useUserData();
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('asc');
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState<string>('description');
  const [showModalFunctions, setShowModalFunctions] = useState(false);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [fpmId, setFpmId] = useState('');
  const fpmDetailsID = useFPMLaunchDetails(fpmId || '');
  const [description, setDescription] = useState('');
  const [incomeAccount, setIncomeAccount] = useState('');
  const [competence, setCompetence] = useState('');
  const [maxReference, setMaxReference] = useState('');
  const [minReference, setMinReference] = useState('');
  const [minCollected, setMinCollected] = useState('');
  const [maxCollected, setMaxCollected] = useState('');
  const [minAccumulated, setMinAccumulated] = useState('');
  const [maxAccumulated, setMaxAccumulated] = useState('');
  const [showModalImport, setShowModalImport] = useState(false);

  const [filterOptionsFpm, setFilterOptionsFpm] =
    useState<FilterOptionsFpm>({
      description: '',
      incomeAccount: '',
      competence: '',
      minReference: '',
      maxReference: '',
      maxAccumulated: '',
      maxCollected: '',
      minAccumulated: '',
      minCollected: '',
    });

  const listFpm = 
    useFPMLaunch(
      selectedPage,
      pageSize,
      search,
      filterOptionsFpm?.incomeAccount || '',
      filterOptionsFpm?.description || '',
      filterOptionsFpm?.competence || '', //new Date().toJSON()
      filterOptionsFpm?.minReference || '',
      filterOptionsFpm?.maxReference || '',
      filterOptionsFpm?.minCollected || '',
      filterOptionsFpm?.maxCollected || '',
      filterOptionsFpm?.minAccumulated || '',
      filterOptionsFpm?.maxAccumulated || '',
      sort,
      sortDirection,
      user?.year ?? '',
      cityConfig
  );

  const mobileColumns = [
    { item: 'descrição', sort: 'description' },
    { item: 'conta', sort: 'incomeAccount' },
  ];

  const buttonColumn = { item: 'ações' };

  const itemsHeaderTable = isWeb
    ? [
      ...mobileColumns,
      { item: 'Retido', sort: 'collected' },
      { item: 'acumulado', sort: 'accumulated' },
      { item: 'Data', sort: 'reference' },
      { item: 'Competência', sort: 'competence' },
      buttonColumn,
    ]
    : 
    [...mobileColumns, buttonColumn];

  const itemsBodyTable = (e: FPMLaunchResp) => {
    const mobileColumns = [e.description, e.incomeAccount];

    const buttons = (
      <Flex>
        <IconButtonComponent
          marginX={1}
          arialLabel="Detalhes"
          toolTipText="Detalhes"
          Icon={<FaInfo />}
          onSubmit={() => {
            setFpmId(e.id);
            setShowModalDetails(true);
          }}
          backgroundColor={'purple.500'}
        />
        <IconButtonComponent
          disabled
          marginX={1}
          arialLabel="Editar"
          toolTipText="Editar"
          Icon={<FaPencilAlt />}
          onSubmit={() => { }}
          backgroundColor={'blue.500'}
        />
        <IconButtonComponent
          disabled
          marginX={1}
          toolTipText="Excluir"
          arialLabel="Excluir"
          Icon={<FaTrash />}
          onSubmit={() => { }}
        />
        {isWeb && (
          <IconButtonComponent
            marginX={1}
            toolTipText="Realizar Validação"
            arialLabel="Validar"
            Icon={<FaCheck />}
            onSubmit={() => { }}
            disabled
            backgroundColor={'green.500'}
          />
        )}
      </Flex>
    );

    if (!isWeb) {
      return [...mobileColumns, buttons];
    }
    return [
      ...mobileColumns,
      moneyMask(e.collected?.toString() || ''),
      moneyMask(e.accumulated?.toString() || ''),
      formatDate(e.reference),
      formatMonthDate(e.competence),
      buttons,
    ];
  };

  function searchFilter() {
    return setFilterOptionsFpm({
      description: description,
      incomeAccount: incomeAccount,
      competence: competence,
      minReference: minReference,
      maxReference: maxReference,
      minAccumulated: minAccumulated,
      maxAccumulated: maxAccumulated,
      maxCollected: maxCollected,
      minCollected: minCollected,
    });
  }

  function cleanFilter() {
    return (
      setDescription(''),
      setIncomeAccount(''),
      setCompetence(''),
      setMinReference(''),
      setMaxReference(''),
      setMinCollected(''),
      setMaxCollected(''),
      setMinAccumulated(''),
      setMaxAccumulated(''),
      setFilterOptionsFpm({
        description: '',
        incomeAccount: '',
        competence: '',
        minReference: '',
        maxReference: '',
        minAccumulated: '',
        maxAccumulated: '',
        maxCollected: '',
        minCollected: '',
      })
    );
  }

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>
          Demonstrativos do Banco do Brasil de {capitalizeFirstLetter((useApiEntities().data?.agiprev.municipioNome || '').toLowerCase())}
        </TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar os demonstrativos do Banco do Brasil
        </TitleTextComponent>

        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          {isWeb ? (
            <Flex>
              <ButtonComponent
                margin={'0 10px 0 0'}
                onSubmit={() => setShowModalImport(true)}
              >
                Importar Demonstrativos do Banco do Brasil
              </ButtonComponent>
              <ButtonComponent
                margin={'0 10px 0 0'}
                disabled
                onSubmit={() => { }}
              >
                Efetuar Lançamento
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

          {!isWeb && (
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
                        onSubmit={() => setShowModalImport(true)}
                      >
                        Importar Demonstrativos do Banco do Brasil
                      </ButtonComponent>
                      <ButtonComponent
                        disabled
                        width={'100%'}
                        margin={'0 0 10px 0'}
                        onSubmit={() => { }}
                      >
                        Efetuar Lançamento
                      </ButtonComponent>
                      <ButtonComponent
                        width={'100%'}
                        margin={'0 0 10px 0'}
                        onSubmit={() => {
                          navigate('/revenues');
                        }}
                      >
                        Voltar para a tela de receitas
                      </ButtonComponent>
                    </>
                  }
                />
              }
            />
          )}

          <Flex>
            {isWeb && (
              <SearchComponent
                value={searchInput}
                onClean={() => setSearch('')}
                onChange={(input) => setSearch(input.target.value)}
              />
            )}
            {
              <FilterComponent
                setShowFilter={setShowFilter}
                showFilter={showFilter}
                onSearch={searchFilter}
                onClean={cleanFilter}
                bodyFilter={
                  <Flex flexWrap={'wrap'}>
                    <InputComponent
                      margin={'10px 0 10px 0'}
                      label={'Descrição'}
                      placeholder="Digite a descrição"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <InputComponent
                      margin={'10px 0 10px 0'}
                      label={'Conta'}
                      placeholder="Digite a conta"
                      value={incomeAccount}
                      onChange={(e) => setIncomeAccount(e.target.value)}
                    />
                    <InputComponent
                      margin={'10px 0 10px 0'}
                      label={'Competência'}
                      type="month"
                      value={competence}
                      onChange={(e) => setCompetence(e.target.value)}
                    />
                    <Flex mt={4} margin={'10px 0 10px 0'} width={'100%'}>
                      <InputComponent
                        marginRight={4}
                        label={'Data Mínima'}
                        type="date"
                        value={minReference}
                        onChange={(e) => setMinReference(e.target.value)}
                      />
                      <InputComponent
                        marginLeft={4}
                        label={'Data Máxima'}
                        type="date"
                        value={maxReference}
                        onChange={(e) => setMaxReference(e.target.value)}
                      />
                    </Flex>
                    <Flex mt={4} margin={'10px 0 10px 0'} width={'100%'}>
                      <InputComponent
                        marginRight={4}
                        label={'Valor Mínimo Retido'}
                        placeholder="Min"
                        value={minCollected}
                        onChange={(e) => setMinCollected(e.target.value)}
                      />
                      <InputComponent
                        marginLeft={4}
                        label={'Valor Máximo Retido'}
                        placeholder="Max"
                        value={maxCollected}
                        onChange={(e) => setMaxCollected(e.target.value)}
                      />
                    </Flex>
                    <Flex mt={4} margin={'10px 0 10px 0'} width={'100%'}>
                      <InputComponent
                        marginRight={4}
                        label={'Valor Mínimo Acumulado'}
                        placeholder="Min"
                        value={minAccumulated}
                        onChange={(e) => setMinAccumulated(e.target.value)}
                      />
                      <InputComponent
                        marginLeft={4}
                        label={'Valor Máximo Acumulado'}
                        placeholder="Max"
                        value={maxAccumulated}
                        onChange={(e) => setMaxAccumulated(e.target.value)}
                      />
                    </Flex>
                  </Flex>
                }
              />
            }
          </Flex>
        </Flex>
        <TableComponent
          ItemsHeader={itemsHeaderTable}
          isLoading={listFpm.isLoading}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={
            listFpm.data?.data?.map((launch) => ({
              items: itemsBodyTable(launch),
            })) ?? []
          }
        />

        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listFpm.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>

        <div style={{ marginLeft: 'auto' }}>
          <ButtonComponent
            width={'max'}
            margin={'0 10px 0 0'}
            onSubmit={() => {
              navigate('/revenues');
            }}
          >
            Voltar para a tela de receitas
          </ButtonComponent>
        </div>
      </Flex>
      <ImportFpmComponent
        type="FPM"
        isOpen={showModalImport}
        onClose={() => {
          setShowModalImport(false);
          listFpm.refetch();
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
                  label="Descrição"
                  value={fpmDetailsID.data?.description}
                />
                <DetailsComponent
                  label="Conta Receita"
                  value={fpmDetailsID.data?.incomeAccount}
                />
                <DetailsComponent
                  label="Retido"
                  value={moneyMask(String(fpmDetailsID.data?.collected))}
                />
                <DetailsComponent
                  label="Acumulado"
                  value={moneyMask(String(fpmDetailsID.data?.accumulated))}
                />
                <DetailsComponent
                  label="Data"
                  value={formatDate(String(fpmDetailsID.data?.reference))}
                />
                <DetailsComponent
                  label="Competência"
                  value={formatMonthDate(String(fpmDetailsID.data?.competence))}
                />
                {!isWeb && (
                  <Flex mb={8} alignItems={'start'} flexDirection={'column'}>
                    <Text mb={1} fontSize={'medium'} color={'gray.500'}>
                      Realizar Validação
                    </Text>
                    <IconButtonComponent
                      marginX={1}
                      toolTipText="Realizar Validação"
                      arialLabel="Validar"
                      Icon={<FaCheck />}
                      onSubmit={() => { }}
                      backgroundColor={'green.500'}
                    />
                  </Flex>
                )}
              </>
            }
          />
        }
      />
    </>
  );
}

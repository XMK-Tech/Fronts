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
import { FaPrint, FaSyncAlt } from 'react-icons/fa';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import { SortDirection } from '../../../services/PhysicalPersonService';
import {
  getAgiprevCalculation,
  getAgiprevCalculationMonth,
  useTotalVerification,
  useVerification,
  VerificationResp,
} from '../../../services/VerificationService';
import {
  cleanMoneyMask,
  moneyMask,
  monthMask,
} from '../../../utils/functions/masks';
import { useUserData } from '../../../services/LoginService';
import { dataTotal } from '../../../utils/functions/utility';

type FilterOptionsVerification = {
  exercise: string;
  maxUpdatedValue: string;
  minUpdatedValue: string;
  maxArbitrateValue: string;
  minArbitrateValue: string;
};
export default function VerificationTemplateComponent() {
  const user = useUserData();
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const isWeb = useIsWeb();
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('name');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingMonth, setIsLoadingMonth] = React.useState<boolean>(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const [filterOptionsVerification, setFilterOptionsVerification] =
    React.useState<FilterOptionsVerification>({
      exercise: '',
      maxArbitrateValue: '',
      minArbitrateValue: '',
      maxUpdatedValue: '',
      minUpdatedValue: '',
    });
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const listVerification = useVerification(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsVerification.exercise,
    filterOptionsVerification.maxArbitrateValue,
    filterOptionsVerification.minArbitrateValue,
    filterOptionsVerification.maxUpdatedValue,
    filterOptionsVerification.minUpdatedValue,
    user?.year ?? ''
  );

  const totalVerification = useTotalVerification(
    search,
    filterOptionsVerification.exercise,
    filterOptionsVerification.maxArbitrateValue,
    filterOptionsVerification.minArbitrateValue,
    filterOptionsVerification.maxUpdatedValue,
    filterOptionsVerification.minUpdatedValue,
    user?.year ?? ''
  );

  const itemsBodyTable = (e: VerificationResp, i: number) => {
    const mobileColumns = [
      moneyMask(String(e.valueToArbitrate)),
      moneyMask(String(e.updateValue)),
    ];

    const buttons = (
      <Flex justifyContent={'center'}>
        <IconButtonComponent
          disabled
          toolTipText="Detalhes"
          arialLabel="Detalhes"
          Icon={<FaSyncAlt />}
          onSubmit={() => {}}
          backgroundColor={'yellow.500'}
        />
        <IconButtonComponent
          marginX={1}
          isLoading={isLoadingMonth}
          disabled={isLoadingMonth}
          arialLabel="Imprimir"
          toolTipText="Imprimir"
          Icon={<FaPrint />}
          backgroundColor={'purple.500'}
          onSubmit={() => {
            setIsLoadingMonth(true);
            getAgiprevCalculationMonth(
              user?.year ?? '',
              Number(e.exercise.split('/')[0])
            )
              .then(() => {
                setIsLoadingMonth(false);
              })
              .catch(() => {
                setIsLoadingMonth(false);
              });
          }}
        />
      </Flex>
    );

    if (!isWeb) {
      return [...mobileColumns, buttons];
    }
    return [...mobileColumns, e.exercise, buttons];
  };
  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Apuração</TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar a lista de apurações cadastradas
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          <Flex>
            <ButtonComponent
              margin={'0 10px 0 0'}
              disabled={isLoading}
              isLoading={isLoading}
              onSubmit={() => {
                setIsLoading(true);
                getAgiprevCalculation(user?.year ?? '')
                  .then(() => {
                    setIsLoading(false);
                  })
                  .catch(() => {
                    setIsLoading(false);
                  });
              }}
            >
              Emitir memorial de cálculo
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
              <FilterVerification
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                setFilterOptionsVerification={setFilterOptionsVerification}
              />
            </Flex>
          }
        </Flex>

        <TableComponent
          centered
          ItemsHeader={[
            { item: 'valor a arbitrar', sort: 'value' },
            { item: 'valor atualizado selic', sort: 'updatedValue' },
            { item: 'competência', sort: 'exercise', hideOnMobile: true },
            { item: 'ações' },
          ]}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listVerification.data?.metadata.dataSize === 0}
          isLoading={listVerification.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={dataTotal(
            listVerification.data?.data?.map((e, i) => ({
              items: itemsBodyTable(e, i),
            })) ?? [],
            totalVerification.data?.data.sum || 0
          )}
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listVerification.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
    </>
  );
}
function FilterVerification(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsVerification: React.Dispatch<
    React.SetStateAction<FilterOptionsVerification>
  >;
}) {
  const [maxArbitrateValue, setMaxArbitrateValue] = React.useState('');
  const [minArbitrateValue, setMinArbitrateValue] = React.useState('');
  const [maxUpdatedValue, setMaxUpdatedValue] = React.useState('');
  const [minUpdatedValue, setMinUpdatedValue] = React.useState('');
  const [exercise, setExercise] = React.useState('');
  function searchFilter() {
    return props.setFilterOptionsVerification({
      exercise: exercise,
      maxArbitrateValue: String(cleanMoneyMask(maxArbitrateValue)),
      minArbitrateValue: String(cleanMoneyMask(minArbitrateValue)),
      maxUpdatedValue: String(cleanMoneyMask(maxUpdatedValue)),
      minUpdatedValue: String(cleanMoneyMask(minUpdatedValue)),
    });
  }
  function cleanFilter() {
    return (
      setExercise(''),
      setMaxArbitrateValue(''),
      setMaxUpdatedValue(''),
      setMinArbitrateValue(''),
      setMinUpdatedValue(''),
      props.setFilterOptionsVerification({
        exercise: '',
        maxArbitrateValue: '',
        minArbitrateValue: '',
        maxUpdatedValue: '',
        minUpdatedValue: '',
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
          <Flex margin={'10px 0 10px 0'} width={'100%'}>
            <InputComponent
              marginRight={4}
              placeholder="min"
              label={'Valor Mínimo a Arbitrar'}
              value={minArbitrateValue}
              onChange={(e) =>
                setMinArbitrateValue(moneyMask(e.target.value, true))
              }
            />
            <InputComponent
              marginLeft={4}
              placeholder="max"
              label={'Valor Máximo a Arbitrar'}
              value={maxArbitrateValue}
              onChange={(e) =>
                setMaxArbitrateValue(moneyMask(e.target.value, true))
              }
            />
          </Flex>
          <Flex margin={'10px 0 10px 0'} width={'100%'}>
            <InputComponent
              marginRight={4}
              placeholder="min"
              label={'Valor Mínimo Atualizado'}
              value={minUpdatedValue}
              onChange={(e) =>
                setMinUpdatedValue(moneyMask(e.target.value, true))
              }
            />
            <InputComponent
              marginLeft={4}
              placeholder="max"
              label={'Valor Máximo Atualizado'}
              value={maxUpdatedValue}
              onChange={(e) =>
                setMaxUpdatedValue(moneyMask(e.target.value, true))
              }
            />
          </Flex>
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Competência"
            placeholder="Digite a competência"
            value={exercise}
            onChange={(e) => setExercise(monthMask(e.target.value))}
          />
        </Flex>
      }
    />
  );
}

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
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import FilterComponent from '../../UI/molecules/FilterComponent/FilterComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../../UI/atoms/SearchComponent/SearchComponent';
import { useDebounce } from '../../../utils/functions/debounce';
import { SortDirection } from '../../../services/PhysicalPersonService';
import { useAccessProfile } from '../../../services/AccessProfileService';
import { useNavigate } from 'react-router-dom';
import { DeleteModalComponent } from '../../UI/molecules/DeleteModalComponent/DeleteModalComponent';
type FilterOptionsAccessProfile = {
  accessProfile: string;
};
export default function AccessProfileTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const navigate = useNavigate();
  const isWeb = useIsWeb();
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('asc');
  const [sort, setSort] = React.useState<string>('accessProfile');
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchInput, search, setSearch] = useDebounce('');
  const [filterOptionsAccessProfile, setFilterOptionsAccessProfile] =
    React.useState<FilterOptionsAccessProfile>({
      accessProfile: '',
    });

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const listAccessProfile = useAccessProfile(
    selectedPage,
    pageSize,
    search,
    sort,
    sortDirection,
    filterOptionsAccessProfile.accessProfile
  );

  return (
    <>
      <Flex flexDirection={'column'}>
        <TitleTextComponent>Perfil de acesso</TitleTextComponent>
        <TitleTextComponent subTitle>
          Você pode visualizar os Perfis
        </TitleTextComponent>
      </Flex>
      <Flex flexDirection={'column'}>
        <Flex mb={2} mt={4} justifyContent={'space-between'}>
          <Flex>
            <ButtonComponent
              margin={'0 10px 0 0'}
              onSubmit={() => {
                navigate('/access-profile-edit');
              }}
            >
              Novo Perfil
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

              <FilterAccessProfile
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                setFilterOptionsAccessProfile={setFilterOptionsAccessProfile}
              />
            </Flex>
          }
        </Flex>

        <TableComponent
          centered
          ItemsHeader={[
            { item: 'perfil', sort: 'name' },
            { item: 'descrição', sort: 'description' },
            { item: 'ações' },
          ]}
          onSortingChanged={(sort, dir) => {
            setSort(sort);
            setSortDirection(dir);
          }}
          emptyState={listAccessProfile.data?.metadata.dataSize === 0}
          isLoading={listAccessProfile.isLoading}
          sorting={{ sortColumn: sort, direction: sortDirection }}
          data={
            listAccessProfile.data?.data?.map((e, i) => ({
              items: [
                e.name,
                e.description,
                <Flex ml={'38%'} key={i}>
                  <IconButtonComponent
                    marginX={1}
                    arialLabel="Editar"
                    toolTipText="Editar"
                    Icon={<FaPencilAlt />}
                    onSubmit={() => {
                      navigate(`/access-profile-edit/${e.id}`);
                    }}
                    backgroundColor={'blue.500'}
                  />
                  <IconButtonComponent
                    toolTipText="Excluir"
                    arialLabel="Excluir"
                    Icon={<FaTrash />}
                    onSubmit={() => {
                      setShowDelete(true);
                    }}
                  />
                </Flex>,
              ],
            })) || []
          }
        />
        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={listAccessProfile.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
      <DeleteModalComponent
        title="Excluir Perfil"
        subTitle="Tem certeza que deseja excluir esse perfil ?"
        showModal={showDelete}
        setShowModal={() => {
          setShowDelete(false);
        }}
      />
    </>
  );
}
function FilterAccessProfile(props: {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  setFilterOptionsAccessProfile: React.Dispatch<
    React.SetStateAction<FilterOptionsAccessProfile>
  >;
}) {
  const [accessProfile, setAccessProfile] = React.useState('');
  function searchFilter() {
    return props.setFilterOptionsAccessProfile({
      accessProfile: accessProfile,
    });
  }
  function cleanFilter() {
    return (
      setAccessProfile(''),
      props.setFilterOptionsAccessProfile({
        accessProfile: '',
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
        <Flex flexWrap={'wrap'} width={'100%'}>
          <InputComponent
            margin={'10px 0 10px 0'}
            label="Perfil"
            placeholder="Digite o Perfil"
            value={accessProfile}
            onChange={(e) => setAccessProfile(e.target.value)}
          />
        </Flex>
      }
    />
  );
}

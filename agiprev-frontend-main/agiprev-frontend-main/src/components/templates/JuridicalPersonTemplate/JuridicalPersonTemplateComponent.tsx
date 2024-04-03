import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import { FaEye } from 'react-icons/fa';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { Stack } from '@chakra-ui/react';
import AvatarLabelComponent from '../../UI/atoms/AvatarLabelComponent/AvatarLabelComponent';
import React from 'react';
import DetailsModalComponent from '../../UI/molecules/DetailsModalComponent/DetailsModalComponent';
import SearchSelectComponent from '../../UI/molecules/SearchSelectComponent/SearchSelectComponent';
import { cnpjMask, cpfMask } from '../../../utils/functions/masks';
import { useDebounce } from '../../../utils/functions/debounce';
import {
  JuridicalPersonResp,
  useJuridicalPerson,
} from '../../../services/JuridicalPersonService';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';

export default function JuridicalPersonTemplateComponent() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const [searchInput, search, setSearch] = useDebounce('');
  const [searchField, setSearchField] = React.useState('name');
  const listJuridicalPerson = useJuridicalPerson(
    selectedPage,
    pageSize,
    search,
    searchField
  );
  const [detailsDialog, setDetailsDialog] = React.useState(false);
  const [selectedJuridicalPerson, setSelectedJuridicalPerson] =
    React.useState<JuridicalPersonResp>();
  const modalCardInfo = [
    { item: 'Razão Social', description: selectedJuridicalPerson?.name },
    {
      item: 'Nome Fantasia',
      description: selectedJuridicalPerson?.displayName,
    },
    { item: 'CNPJ', description: cpfMask(selectedJuridicalPerson?.document) },
    {
      item: 'Email Pessoal',
      description: selectedJuridicalPerson?.personalEmail,
    },
  ];
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }

  return (
    <>
      <Stack
        paddingBottom={5}
        alignItems={'center'}
        justifyContent={'space-between'}
        direction="row"
      >
        <TitleTextComponent>Pessoas Jurídicas</TitleTextComponent>
        <SearchSelectComponent
          onChangeText={(input) => setSearch(input.target.value)}
          inputValue={searchInput}
          onClean={() => setSearch('')}
          onChangeSelect={(item) => {
            setSearchField(item.target.value);
          }}
          options={[
            { id: 'name', name: 'Razão Social' },
            { id: 'displayName', name: 'Nome Fantasia' },
          ]}
        />
      </Stack>
      <TableComponent
        ItemsHeader={[
          { item: 'Razão Social' },
          { item: 'Nome Fantasia' },
          { item: 'CNPJ' },
          { item: 'ações' },
        ]}
        isLoading={listJuridicalPerson.isLoading}
        emptyState={listJuridicalPerson.data?.metadata.dataSize === 0}
        data={
          listJuridicalPerson.data?.data.map((e: JuridicalPersonResp) => ({
            items: [
              <AvatarLabelComponent label={e.name} />,
              e.displayName,
              cnpjMask(e.document),
              <ButtonComponent
                leftIcon={<FaEye />}
                onSubmit={() => {
                  setDetailsDialog(true);
                  setSelectedJuridicalPerson(e);
                }}
              >
                Detalhes
              </ButtonComponent>,
            ],
          })) || []
        }
      />

      <PaginationComponent
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
        arrayLength={listJuridicalPerson.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
      ></PaginationComponent>

      <DetailsModalComponent
        isOpen={detailsDialog}
        title={'Pessoa Jurídica'}
        onClose={() => setDetailsDialog(false)}
        data={modalCardInfo}
        editLink={`/user-register/${selectedJuridicalPerson?.id}/2`}
        imgUrl={selectedJuridicalPerson?.profilePicUrl}
      />
    </>
  );
}

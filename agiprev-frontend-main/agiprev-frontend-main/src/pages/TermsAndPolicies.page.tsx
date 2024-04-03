import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { FaCheckSquare, FaWindowClose } from 'react-icons/fa';
import ButtonComponent from '../components/UI/atoms/ButtonComponent/ButtonComponent';
import TitleTextComponent from '../components/UI/atoms/HeaderTextComponent/TitleTextComponent';
import SearchComponent from '../components/UI/atoms/SearchComponent/SearchComponent';
import TagComponent from '../components/UI/atoms/TagComponent/TagComponent';
import TextComponent from '../components/UI/atoms/TextComponent/TextComponent';
import ModalStructureComponent from '../components/UI/molecules/ModalStructureComponent/ModalStructureComponent';
import {
  PaginationComponent,
  usePagination,
} from '../components/UI/molecules/PaginationComponent/PaginationComponent';
import TableComponent from '../components/UI/molecules/TableComponent/TableComponent';
import TextEditorComponent from '../components/UI/organisms/TextEditorComponent/TextEditorComponent';

import {
  ApplicationPolicyApi,
  useGetApplicationPolicy,
  usePostApplicationPolicy,
  usersAcceptedType,
} from '../services/ApplicationPolicyApi';
import { formatDate } from '../utils/functions/formatDate';

export default function TermsAndPoliciesPage() {
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const { creatPost, isLoading } = usePostApplicationPolicy();
  const dataPolicy = useGetApplicationPolicy(selectedPage, pageSize);
  const [changeText, setChangeText] = useState('');
  const [showModalTerms, setShowModalTerms] = useState(false);
  const [showModalAcceptedTerms, setShowModalAcceptedTerms] = useState(false);
  const [users, setUsers] = useState<usersAcceptedType[]>();

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }

  function onSubmit() {
    creatPost({
      description: changeText,
      title: 'Política',
      policy: 'Política de privacidade',
    });
  }

  return (
    <Flex p={4} flexDirection={'column'}>
      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <TitleTextComponent>Termos e Politicas</TitleTextComponent>
        <Flex>
          <ButtonComponent
            onSubmit={() => setShowModalTerms(true)}
            children={'Novo'}
          />
        </Flex>
      </Flex>

      <TableComponent
        ItemsHeader={[
          { item: 'Título' },
          { item: 'Política' },
          { item: 'Data' },
          { item: 'total de usuários' },
          { item: 'ação' },
        ]}
        emptyState={dataPolicy.data?.data.length === 0}
        isLoading={dataPolicy.isLoading}
        data={
          dataPolicy.data?.data.map((e: ApplicationPolicyApi, i: number) => {
            return {
              items: [
                e.title,
                e.policy,
                formatDate(e.createdAt),
                <>
                  <TextComponent as={'span'} color={'green'}>
                    {e.users?.filter((item) => item.status === 1).length}
                    <FaCheckSquare
                      size={20}
                      style={{ display: 'inline-block', margin: '0 0 5px 2px' }}
                    />
                  </TextComponent>{' '}
                  /
                  <TextComponent
                    style={{ display: 'inline-block', margin: '0 5px 0 5px' }}
                    as={'span'}
                    color={'red'}
                  >
                    {e.users?.filter((item) => item.status !== 1).length}
                    <FaWindowClose
                      size={20}
                      style={{ display: 'inline-block', margin: '0 0 5px 4px' }}
                    />
                  </TextComponent>
                  ({e.users?.length})
                </>,
                <ButtonComponent
                  key={i}
                  onSubmit={() => {
                    setShowModalAcceptedTerms(true);
                    setUsers(e.users);
                  }}
                  children={'ver aceitos'}
                />,
              ],
            };
          }) || []
        }
      />
      <PaginationComponent
        arrayLength={dataPolicy.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
      />

      <ModalTerms
        changeText={changeText}
        isLoading={isLoading}
        onSubmit={onSubmit}
        setChangeText={setChangeText}
        setShowModalTerms={() => setShowModalTerms(false)}
        showModalTerms={showModalTerms}
      />
      <ModalUsers
        setShowModalAcceptedTerms={() => setShowModalAcceptedTerms(false)}
        showModalAcceptedTerms={showModalAcceptedTerms}
        users={users}
      />
    </Flex>
  );
}

function ModalUsers(props: {
  showModalAcceptedTerms: boolean;
  setShowModalAcceptedTerms: () => void;
  users: usersAcceptedType[] | undefined;
}) {
  const [search, setSearch] = useState('');
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const firstItemArray = (selectedPage - 1) * pageSize;
  const lastItemArray = firstItemArray + pageSize;
  const filteredUsers = props.users?.filter((user) =>
    user.name?.toLocaleLowerCase().includes(search.toLowerCase())
  );
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  return (
    <ModalStructureComponent
      isOpen={props.showModalAcceptedTerms}
      onClose={() => props.setShowModalAcceptedTerms()}
      title="Usuários que aceitaram ou negaram os termos"
      size="xl"
    >
      <Flex mb={5} justifyContent={'end'}>
        <SearchComponent onChange={(input) => setSearch(input.target.value)} />
      </Flex>
      <TableComponent
        ItemsHeader={[{ item: 'Nome' }, { item: 'Data' }, { item: 'Status' }]}
        emptyState={filteredUsers?.length === 0}
        isLoading={false}
        data={
          filteredUsers?.slice(firstItemArray, lastItemArray).map((e, i) => ({
            items: [
              e.name,
              formatDate(e.date),
              <TagComponent
                key={i}
                colorScheme={e.status === 1 ? 'teal' : 'red'}
                text={e.statusText || ''}
                size={'sm'}
              />,
            ],
          })) || []
        }
      />
      <PaginationComponent
        arrayLength={filteredUsers?.length || 0}
        maxPageItens={pageSize}
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
      />
    </ModalStructureComponent>
  );
}

function ModalTerms(props: {
  showModalTerms: boolean;
  setShowModalTerms: () => void;
  changeText: string;
  setChangeText: (text: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}) {
  return (
    <ModalStructureComponent
      isOpen={props.showModalTerms}
      onClose={() => props.setShowModalTerms()}
      title="Novo Termo"
      size="full"
    >
      <Flex flexDirection={'column'}>
        <TextEditorComponent
          value={props.changeText}
          setValue={(e) => props.setChangeText(e)}
        />
        <Flex mt={10} mb={5} justifyContent={'end'}>
          <ButtonComponent
            style={{}}
            isLoading={props.isLoading}
            onSubmit={() => props.onSubmit()}
          >
            Salvar
          </ButtonComponent>
        </Flex>
      </Flex>
    </ModalStructureComponent>
  );
}

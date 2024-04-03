import { Grid, useToast } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useAttendaceDetails,
  postTakeResponsibility,
  putAttendanceFinish,
  postTransferResponsibility,
  invalidateAttendance,
} from '../../../services/Attendance';
import { PersonModalComponent } from '../../UI/organisms/PersonModalComponent/PersonModalComponent';
import {
  PhysicalPersonResp,
  usePhysicalPerson,
} from '../../../services/PhysicalPersonService';
import { useDebounce } from '../../../utils/functions/debounce';
import { usePagination } from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { ChatTalkComponent } from '../../UI/organisms/ChatTalkComponent/ChatTalkComponent';
import { ChatDetailsComponent } from '../../UI/organisms/ChatDetailsComponent/ChatDetailsComponent';
import { showToast } from '../../../utils/showToast';
import { getError } from '../../../utils/functions/utility';
import { useQueryClient } from '@tanstack/react-query';

export function ChatTemplateComponent() {
  const params = useParams<{ id: string }>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const attendance = useAttendaceDetails(params.id);
  const attendanceDetails = attendance.data;

  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const [searchInput, search, setSearch] = useDebounce('');
  const [searchField, setSearchField] = React.useState('name');
  const [transferModal, setTransferModal] = React.useState(false);
  const [viwersModal, setViewersModal] = React.useState(false);
  const Person = usePhysicalPerson(
    selectedPage,
    pageSize,
    search,
    searchField,
    'name',
    'asc',
    true
  );
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }

  const persons =
    Person.data?.data.map((e: PhysicalPersonResp) => ({
      name: e.name,
      onSubmit: () => {
        postTransferResponsibility({
          id: params.id || '',
          personId: e.personId,
        })
          .then((res) => {
            invalidateAttendance(params.id || '', queryClient);
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'Chamado transferido com sucesso',
            });
          })
          .catch((err) => {
            console.error(err);
            showToast({
              toast,
              status: 'error',
              title: 'Error',
              description: getError(err),
            });
          });
        setTransferModal(false);
      },
    })) || [];

  const viewers =
    attendanceDetails?.viewers.map((e) => ({
      name: e.userName,
    })) || [];

  return (
    <Grid margin={0} templateColumns="repeat(12, 2fr)">
      <ChatTalkComponent
        attendanceId={params.id || ''}
        onSubmitHeaderButton={() => setViewersModal(true)}
      />
      <ChatDetailsComponent
        AttendanceId={params.id || ''}
        onSubmitTransferButton={() => {
          setTransferModal(true);
        }}
        onSubmitToAssumeButton={() =>
          postTakeResponsibility({ id: params.id || '' })
            .then((res) => {
              invalidateAttendance(params.id || '', queryClient);
              showToast({
                toast,
                status: 'success',
                title: 'Sucesso',
                description: 'Chamado assumido com sucesso',
              });
            })
            .catch((err) => {
              console.error(err);
              showToast({
                toast,
                status: 'error',
                title: 'Error',
                description: getError(err),
              });
            })
        }
        onSubmitConcludeButton={() =>
          putAttendanceFinish(params.id)
            .then((res) => {
              invalidateAttendance(params.id || '', queryClient);
              showToast({
                toast,
                status: 'success',
                title: 'Sucesso',
                description: 'Chamado concluido com sucesso',
              });
            })
            .catch((err) => {
              console.error(err);
              showToast({
                toast,
                status: 'error',
                title: 'Error',
                description: getError(err),
              });
            })
        }
      />
      <PersonModalComponent
        onChangeText={(input) => setSearch(input.target.value)}
        inputValue={searchInput}
        isOpen={transferModal}
        title={'Pessoas'}
        onClose={() => setTransferModal(false)}
        onClean={() => setSearch('')}
        onChangeSelect={(item) => {
          setSearchField(item.target.value);
        }}
        options={[
          { id: 'name', name: 'Nome' },
          { id: 'email', name: 'Email' },
          { id: 'phone', name: 'Telefone' },
          { id: 'document', name: 'Documento' },
        ]}
        onSelectedPageChanged={onSelectedPageChanged}
        selectedPage={selectedPage}
        arrayLength={Person.data?.metadata.dataSize || 0}
        maxPageItens={pageSize}
        items={persons}
        isLoading={Person.isLoading}
      />
      <PersonModalComponent
        title="Observadores"
        onClose={() => setViewersModal(false)}
        isOpen={viwersModal}
        items={viewers}
        isLoading={attendance.isLoading}
      />
    </Grid>
  );
}

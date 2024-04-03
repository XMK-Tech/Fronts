import {
  GridItem,
  Box,
  useBreakpointValue,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useState } from 'react';
import {
  putAttendance,
  useAttendaceDetails,
  useAttendaceHistory,
  postMessage,
  invalidateMessages,
  invalidateAttendance,
} from '../../../../services/Attendance';
import { useAttendaceSubjectById } from '../../../../services/AttendanceSubject';
import { getError } from '../../../../utils/functions/utility';
import { showToast } from '../../../../utils/showToast';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { HeaderChatComponent } from '../../molecules/HeaderChatComponent/HeaderChatComponent';
import { InputChatComponent } from '../../molecules/InputChatComponent/InputChatComponent';
import { TalkComponent } from '../TalkComponent/TalkComponent';
import { AttachmentType, uploadFiles } from '../uploadModel/UploadApi';

type ChatTalkComponentProps = {
  attendanceId: string;
  onSubmitHeaderButton: () => void;
};

export function ChatTalkComponent(props: ChatTalkComponentProps) {
  const colSpanOnBoarding = useBreakpointValue({ base: 12, sm: 8 });
  const toast = useToast();

  const attendance = useAttendaceDetails(props.attendanceId);
  const attendanceDetails = attendance.data;
  const attendanceHistory = useAttendaceHistory(props.attendanceId);
  const attendaceHistoryDetails = attendanceHistory.data;
  const attendanceSubject = useAttendaceSubjectById(
    attendanceDetails?.subjectId,
    attendanceDetails?.subjectId ? true : false
  );
  const attendanceSubjectDetails = attendanceSubject.data;

  const [inputValue, setInputValue] = useState('');
  const [files, setFiles] = React.useState<AttachmentType[]>([]);
  const isFile = files.length > 0;

  const attendanceAttachments = attendanceDetails?.attachments.map((e) => e.id);
  const filesAttachments = files.map((e) => e.id);
  const attachments = [...(attendanceAttachments ?? []), ...filesAttachments];
  const queryClient = useQueryClient();

  const messages =
    attendaceHistoryDetails?.map((e) => ({
      fromRequester: e.createdByManager,
      person: e.userName,
      message: e.message,
      systemGenerated: e.systemGenerated,
      time: String(e.date),
    })) || [];

  const defaultResponses =
    attendanceSubjectDetails?.defaultResponses.map((e) => ({
      response: e.response,
      onSubmitDefaultReponse: () => {
        setInputValue(inputValue + e.response);
      },
    })) || [];

  function handlePostMessage() {
    postMessage({ message: inputValue, id: props.attendanceId || '' })
      .then((res) => {
        invalidateMessages(props.attendanceId, queryClient);
        showToast({
          toast,
          status: 'success',
          title: 'Sucesso',
          description: 'Mensagem enviada com sucesso',
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
  }
  function handlePutMessage() {
    putAttendance({
      attachmentIds: attachments,
      description: attendanceDetails?.description,
      id: props.attendanceId,
      subjectId: attendanceDetails?.subjectId,
      title: attendanceDetails?.title,
    })
      .then((res) => {
        invalidateMessages(props.attendanceId, queryClient);
        invalidateAttendance(props.attendanceId, queryClient);
        showToast({
          toast,
          status: 'success',
          title: 'Sucesso',
          description: 'Documento enviado com sucesso',
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
  }

  return (
    <GridItem
      display={'flex'}
      flexDirection={'column'}
      colSpan={colSpanOnBoarding}
      padding={'20px'}
      paddingTop={'0px'}
      height={{ base: '100%', sm: '100vh' }}
      justifyContent={attendance.isLoading ? 'center' : undefined}
      alignItems={attendance.isLoading ? 'center' : undefined}
    >
      {attendance.isLoading ? (
        <Spinner size={'xl'} color="brand.500"></Spinner>
      ) : (
        <>
          <Box>
            <TextComponent as={'b'} fontSize={'4xl'}>
              Chat
            </TextComponent>
            <HeaderChatComponent
              onSubmit={() => props.onSubmitHeaderButton()}
              name={attendanceDetails?.requesterName}
            ></HeaderChatComponent>
          </Box>
          <Box>
            <TalkComponent items={messages.reverse()}></TalkComponent>
          </Box>
          <Box>
            <InputChatComponent
              inputValue={inputValue}
              onChangeInput={(input) => {
                setInputValue(input.target.value);
              }}
              onSubmitSendButton={() => {
                if (isFile) {
                  handlePutMessage();
                }
                if (inputValue) {
                  handlePostMessage();
                }
                setInputValue('');
              }}
              defaultResponses={defaultResponses}
              onDrop={async (acceptedFiles) => {
                const responses = await uploadFiles(acceptedFiles);
                setFiles(responses);
              }}
            />
          </Box>
        </>
      )}
    </GridItem>
  );
}

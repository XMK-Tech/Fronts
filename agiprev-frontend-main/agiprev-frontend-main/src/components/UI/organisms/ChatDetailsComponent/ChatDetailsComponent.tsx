import {
  Box,
  Flex,
  GridItem,
  Spinner,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaCheck, FaPeopleArrows, FaUserPlus } from 'react-icons/fa';
import { useAttendaceDetails } from '../../../../services/Attendance';
import { formatHour } from '../../../../utils/functions/formatDate';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import ScrollableFeedComponent from '../../atoms/ScrollableFeedComponent/ScrollableFeedComponent';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import {
  DocumentComponent,
  EmptyStateDocumentComponent,
} from '../../molecules/DocumentComponent/DocumentComponent';
import { ResponsibleDetails } from '../../molecules/ResponsibleDetails/ResponsibleDetails';

type ChatDetailsComponentProps = {
  AttendanceId: string;
  onSubmitTransferButton: () => void;
  onSubmitToAssumeButton: () => void;
  onSubmitConcludeButton: () => void;
};

export function ChatDetailsComponent(props: ChatDetailsComponentProps) {
  const colSpanStepper = useBreakpointValue({ base: 12, sm: 4 });

  const attendance = useAttendaceDetails(props.AttendanceId);
  const attendanceDetails = attendance.data;

  return (
    <GridItem colSpan={colSpanStepper}>
      <Flex
        direction={'column'}
        height={{ base: '100%', sm: '100vh' }}
        backgroundColor={'brand.500'}
        padding={5}
        justifyContent={attendance.isLoading ? 'center' : undefined}
        alignItems={attendance.isLoading ? 'center' : undefined}
      >
        {attendance.isLoading ? (
          <Spinner size={'xl'} color="white"></Spinner>
        ) : (
          <>
            <Box marginBottom={15}>
              <TextComponent as={'b'} color={'white'} fontSize={'2xl'}>
                Detalhes
              </TextComponent>
              <ResponsibleDetails
                style={{ marginTop: 15 }}
                hour={formatHour(attendanceDetails?.date.toString())}
                subject={attendanceDetails?.subject}
                status={attendanceDetails?.attendanceStatus || 0}
                label={attendanceDetails?.responsibleName || 'Não Definido'}
                subLabel="Atendente"
              />
            </Box>
            <Box>
              <TextComponent as={'b'} color={'white'} fontSize={'2xl'}>
                Ações
              </TextComponent>
              <Stack
                direction={'row'}
                justifyContent={'space-around'}
                marginY={15}
              >
                <ButtonComponent
                  colorScheme={'whiteAlpha'}
                  backgroundColor="#fff"
                  textColor={'#3182CE'}
                  onSubmit={() => props.onSubmitTransferButton()}
                  leftIcon={<FaPeopleArrows />}
                  isLoading={attendance.isLoading}
                >
                  Transferir
                </ButtonComponent>
                {attendanceDetails?.responsibleName ? (
                  <></>
                ) : (
                  <ButtonComponent
                    colorScheme={'whiteAlpha'}
                    backgroundColor="#fff"
                    textColor={'#3182CE'}
                    onSubmit={() => props.onSubmitToAssumeButton()}
                    leftIcon={<FaUserPlus />}
                  >
                    Assumir
                  </ButtonComponent>
                )}
                <ButtonComponent
                  colorScheme={'whiteAlpha'}
                  backgroundColor="#fff"
                  textColor={'#3182CE'}
                  onSubmit={() => props.onSubmitConcludeButton()}
                  leftIcon={<FaCheck />}
                >
                  Concluir
                </ButtonComponent>
              </Stack>
            </Box>
            <Box>
              <>
                <TextComponent as={'b'} color={'white'} fontSize={'2xl'}>
                  Documentos na Conversa
                </TextComponent>
                <Flex direction={'column'} height={310}>
                  <ScrollableFeedComponent>
                    {attendanceDetails?.attachments.length ? (
                      attendanceDetails.attachments.map((e, i) => (
                        <DocumentComponent
                          key={i}
                          DocumentName={e.displayName}
                          documentType={e.type}
                        />
                      ))
                    ) : (
                      <EmptyStateDocumentComponent />
                    )}
                  </ScrollableFeedComponent>
                </Flex>
              </>
            </Box>
          </>
        )}
      </Flex>
    </GridItem>
  );
}

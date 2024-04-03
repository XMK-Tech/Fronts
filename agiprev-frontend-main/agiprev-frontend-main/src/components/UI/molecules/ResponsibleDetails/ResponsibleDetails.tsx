import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { AttendanceStatus } from '../../../../services/Attendance';
import { getStatusColorByType } from '../../../templates/CalledTemplate/CalledTemplateComponent';
import AvatarLabelComponent from '../../atoms/AvatarLabelComponent/AvatarLabelComponent';

type AttendanceDetailsProps = {
  label?: string;
  subLabel?: string;
  src?: string;
  hour?: string;
  subject?: string;
  style?: CSSProperties;
  status?: AttendanceStatus;
};
type TextInformationProps = {
  text?: string;
  description?: string;
  status?: AttendanceStatus;
  width?: string;
};

export function ResponsibleDetails(props: AttendanceDetailsProps) {
  function TextInformation(props: TextInformationProps) {
    return (
      <Stack direction={'row'} width={props.width}>
        <Text fontWeight={'700'} as="a">
          {props.text}
        </Text>
        {props.status === 0 || props.status ? (
          getStatusColorByType(props.status)
        ) : (
          <Text noOfLines={1}>{props.description}</Text>
        )}
      </Stack>
    );
  }

  return (
    <Flex background={'white'} borderRadius={8} padding={5} style={props.style}>
      <Box width={'100%'}>
        <Stack marginBottom={3}>
          <AvatarLabelComponent
            size={'md'}
            label={props.label}
            subLabel={props.subLabel}
            src={props.src}
          />
        </Stack>
        <Stack direction={'row'} marginBottom={3}>
          <TextInformation
            width="40%"
            text={'Hora:'}
            description={props.hour}
          />
          <TextInformation text={'Assunto:'} description={props.subject} />
        </Stack>
        <Stack direction={'row'}>
          <TextInformation text={'Status:'} status={props.status} />
        </Stack>
      </Box>
    </Flex>
  );
}

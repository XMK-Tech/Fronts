import { Box, Center, Flex, Text } from '@chakra-ui/react';
import * as V from 'victory';
import CircleLabelComponent from '../../atoms/CircleLabelComponent/CircleLabelComponent';
import HeaderCardComponent from '../../atoms/HeaderCardComponent/HeaderCardComponent';

type DashBoardPieComponentProps = {
  data: { x: string; y: number }[];
  dashSize?: number;
  containerSize?: number;
  colorScale: string[];
  header: { title: string; headerComponentRigth?: React.ReactNode };
};
export default function DashBoardPieComponent(
  props: DashBoardPieComponentProps
) {
  return (
    <Box width={props.containerSize || 300}>
      <HeaderCardComponent
        title={props.header.title}
        headerComponentRigth={props.header.headerComponentRigth}
      />
      <Center>
        <Box width={props.dashSize || 250}>
          <V.VictoryPie
            colorScale={props.colorScale}
            data={props.data}
            innerRadius={100}
            labelRadius={120}
            style={{ labels: { display: 'none' } }}
          />
        </Box>
        <Text position={'absolute'} fontSize={40} fontWeight={'bold'}>
          100
        </Text>
      </Center>
      {props.data.map((e, i) => (
        <Flex
          marginBottom={2}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex alignItems={'center'}>
            <CircleLabelComponent
              label={e.x}
              circleIconColor={props.colorScale[i]}
            />
          </Flex>
          <Text color="gray" fontWeight={'medium'} fontSize={'md'}>
            {e.y}%
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

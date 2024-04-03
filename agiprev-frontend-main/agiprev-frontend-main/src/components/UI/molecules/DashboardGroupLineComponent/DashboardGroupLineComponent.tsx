import { Flex } from '@chakra-ui/react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryThemeDefinition,
} from 'victory';
import { brand } from '../../../../theme';
import DataBoxComponent from '../../atoms/DataBox/DataBoxComponent';
import HeaderCardComponent from '../../atoms/HeaderCardComponent/HeaderCardComponent';
import TextComponent from '../../atoms/TextComponent/TextComponent';
type LinesDash = {
  dataLine: { x?: string | number; y: number }[];
  colorLine?: string;
};
export type DashboardGroupLineComponentProps = {
  header: { title: string; headerComponentRigth?: React.ReactNode };
  subtitle: string;
  verticalLabels?: number[];
  horizontalLabels?: number[];
  linesDash: LinesDash[];
  dataBoxes: { title: string; info: string }[];
};

const chartTheme: VictoryThemeDefinition = {
  axis: {
    style: {
      axis: {
        stroke: 'transparent',
      },
      grid: {
        pointerEvents: 'painted',
        stroke: 'transparent',
        strokeWidth: 1,
      },
      tickLabels: {
        fill: brand[900],
        fontSize: '14px',
        padding: 5,
        stroke: 'transparent',
      },
    },
  },
  dependentAxis: {
    style: {
      axis: {
        stroke: 'transparent',
      },
      grid: {
        pointerEvents: 'painted',
        stroke: brand[900],
        strokeWidth: 0.5,
      },
      tickLabels: {
        fill: brand[900],
        fontSize: '14px',
        padding: 5,
        stroke: 'transparent',
      },
    },
  },
};

export default function DashboardGroupLineComponent(
  props: DashboardGroupLineComponentProps
) {
  return (
    <Flex flexDirection={'column'}>
      <HeaderCardComponent
        title={props.header.title}
        headerComponentRigth={props.header.headerComponentRigth}
      />
      <TextComponent fontSize={'14px'} color={'black'} fontWeight={'600'}>
        {props.subtitle}
      </TextComponent>
      <Flex m={'20px 0 0 0'} justifyContent={'space-between'} width={'100%'}>
        {props.dataBoxes.map((e) => (
          <DataBoxComponent title={e.title} info={e.info} />
        ))}
      </Flex>

      <VictoryChart width={500} height={250} theme={chartTheme}>
        {props.horizontalLabels && (
          <VictoryAxis tickValues={props.horizontalLabels} />
        )}
        {props.verticalLabels && (
          <VictoryAxis dependentAxis tickValues={props.verticalLabels} />
        )}
        {props.linesDash.map((e, i) => (
          <VictoryLine
            style={{ data: { stroke: e.colorLine || brand[300] } }}
            interpolation={'natural'}
            key={i}
            data={e.dataLine}
          />
        ))}
      </VictoryChart>
    </Flex>
  );
}

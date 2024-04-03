import { Flex, Box } from '@chakra-ui/react';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryStack } from 'victory';

import CircleLabelComponent from '../../atoms/CircleLabelComponent/CircleLabelComponent';
import HeaderCardComponent from '../../atoms/HeaderCardComponent/HeaderCardComponent';
type LinesDash = {
  dataLine: { x?: string; y: number }[];
  colorLine?: string;
  label: string;
};
export type DashboardGroupBarComponentProps = {
  lineSize?: number;
  header: { title: string; headerComponentRigth?: React.ReactNode };
  linesSpacing?: number;
  linesDash: LinesDash[];
  dataValue: number[];
};

export default function DashboardGroupBarComponent(
  props: DashboardGroupBarComponentProps
) {
  const dataLines = props.dataValue.map((e) =>
    props.linesDash.map((e) => e.dataLine.map((e) => ({ x: e.x, y: e.y })))
  );
  return (
    <Flex flexDirection={'column'}>
      <HeaderCardComponent
        title={props.header.title}
        headerComponentRigth={props.header.headerComponentRigth}
      />
      <Box mt={4}>
        {props.linesDash.map((e) => (
          <CircleLabelComponent
            label={e.label}
            circleIconColor={e.colorLine || 'brand.500'}
          ></CircleLabelComponent>
        ))}
      </Box>

      <VictoryChart
        domainPadding={{ x: props.linesSpacing || 50 }}
        width={500}
        height={250}
      >
        <VictoryGroup
          offset={props.lineSize || 20}
          style={{ data: { width: props.lineSize || 20 } }}
        >
          {props.linesDash.map((e) => (
            <VictoryStack>
              {dataLines.map((data: any, i: any) => (
                <VictoryBar
                  colorScale={[e.colorLine || 'brand.500']}
                  key={i}
                  data={e.dataLine}
                />
              ))}
            </VictoryStack>
          ))}
        </VictoryGroup>
      </VictoryChart>
    </Flex>
  );
}

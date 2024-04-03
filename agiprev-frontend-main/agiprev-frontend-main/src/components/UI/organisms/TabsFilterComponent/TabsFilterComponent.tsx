import {
  TabList,
  Tabs,
  Tab,
  SystemStyleObject,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';
import { CSSProperties } from 'react';

type TabsFilterComponentProps = {
  contentStyle?: CSSProperties;
  style?: CSSProperties;
  bg?: ChakraButtonProps['color'];
  selectedStyle?: SystemStyleObject;
  tabList: {
    title: string;
    onClick: () => void;
  }[];
};

export function TabsFilterComponent(props: TabsFilterComponentProps) {
  return (
    <Tabs variant="unstyled">
      <TabList style={props.contentStyle}>
        {props.tabList.map((e, i) => (
          <Tab
            style={props.style}
            key={i}
            fontWeight="600"
            mr={2}
            onClick={e.onClick}
            bg={props.bg ? props.bg : 'gray.200'}
            borderRadius={5}
            _selected={
              props.selectedStyle
                ? props.selectedStyle
                : {
                    color: 'white',
                    fontWeight: '600',
                    bg: 'blue.500',
                  }
            }
          >
            {e.title}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}

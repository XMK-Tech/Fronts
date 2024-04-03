import { TabList, Tabs, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

export type TabsComponentProps = {
  orientation: 'vertical' | 'horizontal';
  headers: string[];
  panels: React.ReactNode[];
};

export default function TabsComponent(props: TabsComponentProps) {
  return (
    <Tabs orientation={props.orientation}>
      <TabList>
        {props.headers.map((header, headerI) => (
          <Tab key={headerI}>{header}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {props.panels.map((panel, panelI) => (
          <TabPanel key={panelI}>{panel}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

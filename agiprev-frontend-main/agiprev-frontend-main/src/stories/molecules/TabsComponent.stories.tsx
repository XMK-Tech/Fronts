import { Story } from '@storybook/react';
import TabsComponent, {
  TabsComponentProps,
} from '../../components/UI/molecules/TabsComponent/TabsComponent';

export default {
  component: TabsComponent,
  title: 'Molecules/TabsComponent',
};

const Template: Story<TabsComponentProps> = (args) => (
  <TabsComponent {...args} />
);

export const Vertical = Template.bind({});
Vertical.args = {
  orientation: 'vertical',
  headers: ['item 1', 'item 2', 'item 3'],
  panels: ['panel 1', 'panel 2', 'panel 3'],
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  orientation: 'horizontal',
  headers: ['item 1', 'item 2', 'item 3'],
  panels: ['panel 1', 'panel 2', 'panel 3'],
};

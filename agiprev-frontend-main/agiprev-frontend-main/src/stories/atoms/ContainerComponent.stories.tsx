import { Story } from '@storybook/react';
import ContainerComponent, {
  ContainerProps,
} from '../../components/UI/atoms/ContainerComponent/ContainerComponent';

export default {
  component: ContainerComponent,
  title: 'Atoms/ContainerComponent',
};

const Template: Story<ContainerProps> = (args) => (
  <ContainerComponent {...args} />
);

export const Container = Template.bind({});
Container.args = {
  className: 'w-50 m-auto',
};

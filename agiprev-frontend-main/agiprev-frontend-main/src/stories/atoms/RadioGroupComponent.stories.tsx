import { Story } from '@storybook/react';
import RadioGroupComponent, {
  RadioGroupProps,
} from '../../components/UI/atoms/RadioGroupComponent/RadioGroupComponent';

export default {
  component: RadioGroupComponent,
  title: 'Atoms/RadioGroupComponent',
};

const Template: Story<RadioGroupProps> = (args) => (
  <RadioGroupComponent {...args} />
);

export const RadioGroup = Template.bind({});
RadioGroup.args = {
  options: [
    { id: '1', name: 'Masculino' },
    { id: '2', name: 'Feminino' },
  ],
};

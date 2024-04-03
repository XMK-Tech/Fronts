import { Story } from '@storybook/react';
import InputSelectComponent, {
  InputSelectProps,
} from '../../components/UI/atoms/InputSelectComponent/InputSelectComponent';

export default {
  component: InputSelectComponent,
  title: 'Atoms/InputSelectComponent',
};

const Template: Story<InputSelectProps> = (args) => (
  <InputSelectComponent {...args} />
);

export const InputSelectGender = Template.bind({});
InputSelectGender.args = {
  options: [
    { id: '1', name: 'Masculino' },
    { id: '2', name: 'Feminino' },
  ],
  label: 'Gênero',
  placeholder: 'Selecione o seu gênero',
};

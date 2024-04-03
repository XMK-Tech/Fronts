import { Story } from '@storybook/react';
import InputCheckComponent, {
  InputCheckProps,
} from '../../components/UI/atoms/InputCheckComponent/InputCheckComponent';

export default {
  component: InputCheckComponent,
  title: 'Atoms/InputCheckComponent',
};

const Template: Story<InputCheckProps> = (args) => (
  <InputCheckComponent {...args} />
);

export const Remind = Template.bind({});
Remind.args = {
  label: 'Lembrar-me',
  type: 'checkbox',
  placeholder: 'Digite seu email',
};

import { Story } from '@storybook/react';
import InputComponent, {
  InputProps,
} from '../../components/UI/atoms/InputComponent/InputComponent';

export default {
  component: InputComponent,
  title: 'Atoms/InputComponent',
};

const Template: Story<InputProps> = (args) => <InputComponent {...args} />;

export const Email = Template.bind({});
Email.args = {
  label: 'Email',
  type: 'email',
  placeholder: 'Digite seu email',
};

export const Password = Template.bind({});
Password.args = {
  label: 'Password',
  type: 'password',
  placeholder: 'Digite sua senha',
};

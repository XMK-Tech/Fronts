import { Story } from '@storybook/react';
import LoginFormComponent, {
  LoginFormProps,
} from '../../components/UI/organisms/LoginFormComponent/LoginFormComponent';

export default {
  component: LoginFormComponent,
  title: 'Molecules/LoginFormComponent',
};

const Template: Story<LoginFormProps> = (args) => (
  <LoginFormComponent {...args} />
);

export const LoginForm = Template.bind({});
LoginForm.args = {
  style: { width: 315, boxShadow: 'none' },
};

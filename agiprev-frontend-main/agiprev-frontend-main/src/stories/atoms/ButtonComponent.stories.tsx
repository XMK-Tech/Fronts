import { Story } from '@storybook/react';
import ButtonComponent, {
  ButtonProps,
} from '../../components/UI/atoms/ButtonComponent/ButtonComponent';

export default {
  component: ButtonComponent,
  title: 'Atoms/ButtonComponent',
};

const Template: Story<ButtonProps> = (args) => <ButtonComponent {...args} />;

export const Button = Template.bind({});
Button.args = {
  onSubmit: () => {},
  children: 'Botão',
  disabled: false,
};

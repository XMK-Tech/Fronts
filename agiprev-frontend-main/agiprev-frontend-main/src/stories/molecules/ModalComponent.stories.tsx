import { Story } from '@storybook/react';
import ModalComponent, {
  ModalComponentProps,
} from '../../components/UI/molecules/ModalComponent/ModalComponent';

export default {
  component: ModalComponent,
  title: 'Molecules/ModalComponent',
};

const Template: Story<ModalComponentProps> = (args) => (
  <ModalComponent {...args} />
);

export const Success = Template.bind({});
Success.args = {
  title: 'Concluído',
  body: 'You’ve officially done something really nice. Well done for making it happen, you deserve a cookie!',
  isOpen: true,
  notificationType: 'success',
};

export const Error = Template.bind({});
Error.args = {
  title: 'Erro',
  body: 'You’ve officially done something really nice. Well done for making it happen, you deserve a cookie!',
  isOpen: true,
  notificationType: 'error',
};

export const Info = Template.bind({});
Info.args = {
  title: 'Informação',
  body: 'You’ve officially done something really nice. Well done for making it happen, you deserve a cookie!',
  isOpen: true,
  notificationType: 'info',
};

export const SuccessBig = Template.bind({});
SuccessBig.args = {
  title: 'Concluído',
  body: 'You’ve officially done something really nice. Well done for making it happen, you deserve a cookie!',
  isOpen: true,
  notificationType: 'success',
  type: 'big',
};

export const ErrorBig = Template.bind({});
ErrorBig.args = {
  title: 'Erro',
  body: 'You’ve officially done something really nice. Well done for making it happen, you deserve a cookie!',
  isOpen: true,
  notificationType: 'error',
  type: 'big',
};

export const InfoBig = Template.bind({});
InfoBig.args = {
  title: 'Informação',
  body: 'You’ve officially done something really nice. Well done for making it happen, you deserve a cookie!',
  isOpen: true,
  notificationType: 'info',
  type: 'big',
};

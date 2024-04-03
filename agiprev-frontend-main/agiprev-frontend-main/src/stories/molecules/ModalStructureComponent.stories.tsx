import { Story } from '@storybook/react';
import ModalStructureComponent, {
  ModalStructureComponentProps,
} from '../../components/UI/molecules/ModalStructureComponent/ModalStructureComponent';

export default {
  component: ModalStructureComponent,
  title: 'Molecules/ModalStructureComponent',
};

const Template: Story<ModalStructureComponentProps> = (args) => (
  <ModalStructureComponent {...args} />
);

export const Modal = Template.bind({});
Modal.args = {
  title: 'Pessoa',
  isOpen: true,
  onClose: () => {},
  children: 'teste body',
  size: 'xl',
};

import { Story } from '@storybook/react';
import DetailsModalComponent, {
  DetailsModalComponentProps,
} from '../../components/UI/molecules/DetailsModalComponent/DetailsModalComponent';

export default {
  component: DetailsModalComponent,
  title: 'Molecules/DetailsModalComponent',
};

const modalCardInfo = [
  { item: 'Nome', description: '22342' },
  { item: 'Email', description: '35423' },
  { item: 'Telefone', description: '45354' },
  { item: 'Documento', description: '56757' },
  { item: 'Município', description: '12231' },
  { item: 'Bairro', description: '35646' },
  { item: 'Celular', description: '586754' },
  { item: 'Outro Contato', description: '4566' },
];

const Template: Story<DetailsModalComponentProps> = (args) => (
  <DetailsModalComponent {...args} />
);

export const Details = Template.bind({});
Details.args = {
  title: 'Pessoa',
  data: modalCardInfo,
  infoCard:
    'You’ve officially done something really nice. Well done for making it happen, you deserve a cookie!',
  isOpen: true,
  editLink: '',
  onClose: () => {},
};

import { Story } from '@storybook/react';
import LinkComponent from '../../components/UI/atoms/LinkComponent/LinkComponent';
import DashboardGroupBarComponent, {
  DashboardGroupBarComponentProps,
} from '../../components/UI/molecules/DashboardGroupBarComponent/DashboardGroupBarComponent';

export default {
  title: 'Molecules/DashboardGroupBarComponent',
  component: DashboardGroupBarComponent,
};

const Template: Story<DashboardGroupBarComponentProps> = (args) => (
  <DashboardGroupBarComponent {...args} />
);

export const Area = Template.bind({});
Area.args = {
  header: {
    title: 'Relatório de Vendas',
    headerComponentRigth: <LinkComponent to="">Detalhes</LinkComponent>,
  },
  lineSize: 25,
  dataValue: [10, 50, 100, 250, 350, 500],
  linesDash: [
    {
      colorLine: '#98BDFF',
      label: 'Vendas Online',
      dataLine: [
        { x: 'Jan', y: 70 },
        { x: 'Fev', y: 20 },
        { x: 'Mar', y: 80 },
        { x: 'Abr', y: 20 },
        { x: 'Mai', y: 50 },
      ],
    },
    {
      colorLine: '#1A5CB0',
      label: 'Vendas Presenciais',
      dataLine: [
        { x: 'Jan', y: 50 },
        { x: 'Fev', y: 30 },
        { x: 'Mar', y: 90 },
        { x: 'Abr', y: 60 },
        { x: 'Mai', y: 20 },
      ],
    },
  ],
};

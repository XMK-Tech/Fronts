import { Story } from '@storybook/react';
import LinkComponent from '../../components/UI/atoms/LinkComponent/LinkComponent';
import DashboardGroupLineComponent, {
  DashboardGroupLineComponentProps,
} from '../../components/UI/molecules/DashboardGroupLineComponent/DashboardGroupLineComponent';

export default {
  title: 'Molecules/DashboardGroupLineComponent',
  component: DashboardGroupLineComponent,
};

const Template: Story<DashboardGroupLineComponentProps> = (args) => (
  <DashboardGroupLineComponent {...args} />
);

export const GroupLine = Template.bind({});
GroupLine.args = {
  header: {
    title: 'Detalhamento de Leads',
    headerComponentRigth: <LinkComponent to="">Detalhes</LinkComponent>,
  },
  subtitle:
    'Aqui vai uma explicação sobre os dados no relatório, paramêtros de exibição e coisas do tipo',
  dataBoxes: [
    {
      title: 'Valor Total',
      info: '12.3k',
    },
    {
      title: 'Vendas',
      info: '14k',
    },
    {
      title: 'Leads',
      info: '71.56%',
    },
    {
      title: 'Downloads',
      info: '34040',
    },
  ],
  horizontalLabels: [10, 20, 30, 40, 50, 60, 70],
  verticalLabels: [200, 400, 600, 800, 1000, 1200],
  linesDash: [
    {
      colorLine: '#F3797E',
      dataLine: [
        { x: 0, y: 500 },
        { x: 10, y: 580 },
        { x: 15, y: 320 },
        { x: 20, y: 450 },
        { x: 25, y: 330 },
        { x: 30, y: 620 },
        { x: 35, y: 420 },
        { x: 40, y: 580 },
        { x: 45, y: 550 },
        { x: 50, y: 780 },
        { x: 55, y: 300 },
        { x: 60, y: 400 },
        { x: 65, y: 310 },
        { x: 70, y: 800 },
      ],
    },
    {
      colorLine: '#1A5CB0',
      dataLine: [
        { x: 0, y: 200 },
        { x: 10, y: 300 },
        { x: 15, y: 600 },
        { x: 20, y: 580 },
        { x: 25, y: 400 },
        { x: 30, y: 600 },
        { x: 35, y: 800 },
        { x: 40, y: 580 },
        { x: 45, y: 400 },
        { x: 50, y: 580 },
        { x: 55, y: 400 },
        { x: 60, y: 590 },
        { x: 65, y: 300 },
        { x: 70, y: 700 },
      ],
    },
    {
      colorLine: '#1A5CB0',
      dataLine: [
        { x: 0, y: 200 },
        { x: 10, y: 300 },
        { x: 15, y: 600 },
        { x: 20, y: 580 },
        { x: 25, y: 400 },
        { x: 30, y: 600 },
        { x: 35, y: 800 },
        { x: 40, y: 580 },
        { x: 45, y: 400 },
        { x: 50, y: 580 },
        { x: 55, y: 400 },
        { x: 60, y: 590 },
        { x: 65, y: 300 },
        { x: 70, y: 700 },
      ],
    },
  ],
};

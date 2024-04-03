import { Story } from '@storybook/react';
import LinkComponent from '../../components/UI/atoms/LinkComponent/LinkComponent';
import DashboardAreaComponent, {
  DashboardAreaComponentProps,
} from '../../components/UI/molecules/DashboardAreaComponent/DashboardAreaComponent';

export default {
  title: 'Molecules/DashboardAreaComponent',
  component: DashboardAreaComponent,
};

const Template: Story<DashboardAreaComponentProps> = (args) => (
  <DashboardAreaComponent {...args} />
);

export const Area = Template.bind({});
Area.args = {
  header: {
    title: 'Curvas ( ABC / estoque )',
    headerComponentRigth: <LinkComponent to="">Detalhes</LinkComponent>,
  },
  subtitle: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia aperiam accusamus
  consectetur quibusdam quasi repellendus temporibus laborum .`,
  dataBoxes: [
    {
      title: 'Classe A',
      info: '20%',
    },
    {
      title: 'Classe B',
      info: '30%',
    },
    {
      title: 'Classe C',
      info: '50%',
    },
  ],
  horizontalLabels: [0, 50, 100, 150, 200],
  verticalLabels: [0, 100, 300, 400, 500, 600, 700],
  linesDash: [
    {
      colorLine: '#4B49AC',
      dataLine: [
        { x: 0, y: 0 },
        { x: 25, y: 400 },
        { x: 75, y: 550 },
        { x: 75, y: 0, label: 'A' },
      ],
    },
    {
      colorLine: '#4B49AC',
      dataLine: [
        { x: 75, y: 550 },
        { x: 150, y: 575 },
        { x: 150, y: 0, label: 'B' },
      ],
    },
    {
      colorLine: '#4B49AC',
      dataLine: [
        { x: 150, y: 575 },
        { x: 200, y: 600 },
        { x: 200, y: 0, label: 'C' },
      ],
    },
  ],
};

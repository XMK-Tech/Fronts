import DashboardPieComponent from '../../components/UI/molecules/DashboardPieComponent/DashboardPieComponent';

export default {
  title: 'Molecules/DashboardPieComponent',
  component: DashboardPieComponent,
};
const colorScale = ['#4B49AC', '#FFC100', '#248AFD'];
const data = [
  { x: 'Vendas Online', y: 25 },
  { x: 'Vendas Presenciais', y: 35 },
  { x: 'Telemarketing', y: 40 },
];
export const DashBoardPie = () => (
  <DashboardPieComponent
    header={{ title: 'Dashboard de Vendas', headerComponentRigth: 'Detalhes' }}
    data={data}
    colorScale={colorScale}
  />
);

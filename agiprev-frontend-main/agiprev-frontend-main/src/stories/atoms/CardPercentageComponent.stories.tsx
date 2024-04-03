import CardPercentageComponent from '../../components/UI/atoms/CardPercentageComponent/CardPercentageComponent';

export default {
  title: 'Atoms/CardPercentageComponent',
  component: CardPercentageComponent,
};

export const CardPercentageIncrease = () => (
  <CardPercentageComponent
    title="Valor Mensal"
    value={'34.140,00'}
    type={'increase'}
    percentage={'23'}
    percentageLabel={'(mês atual)'}
    cardWidth={250}
  />
);
export const CardPercentageDecrease = () => (
  <CardPercentageComponent
    title="Valor Mensal"
    value={'34.140,00'}
    percentage={'23'}
    type={'decrease'}
    percentageLabel={'(mês atual)'}
    cardWidth={350}
  />
);

import DetailsComponent from '../../components/UI/atoms/DetailsComponent/DetailsComponet';

export default {
  title: 'Atoms/DetailsComponent',
  component: DetailsComponent,
};

export const DetailsComponentModel = () => (
  <DetailsComponent label="Dia" value="10/05/2022" />
);
export const DetailsComponentWithBg = () => (
  <DetailsComponent
    label="Hora inicial"
    value="10:30"
    backgroundColor="brand.600"
  />
);

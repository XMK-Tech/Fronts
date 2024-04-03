import HeaderCardComponent from '../../components/UI/atoms/HeaderCardComponent/HeaderCardComponent';
import LinkComponent from '../../components/UI/atoms/LinkComponent/LinkComponent';

export default {
  title: 'Atoms/HeaderCardComponent',
  component: HeaderCardComponent,
};

export const HeaderCard = () => (
  <HeaderCardComponent
    title="Título"
    headerComponentRigth={<LinkComponent to="">Detalhes</LinkComponent>}
  />
);

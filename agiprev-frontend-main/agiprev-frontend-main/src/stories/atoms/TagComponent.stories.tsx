import TagComponent from '../../components/UI/atoms/TagComponent/TagComponent';

export default {
  title: 'Atoms/TagComponent',
  component: TagComponent,
};

export const Tag = () => (
  <TagComponent text="Ativo" size="sm" colorScheme="teal" />
);
export const TagInactive = () => (
  <TagComponent text="Inativo" size="sm" colorScheme="red" />
);

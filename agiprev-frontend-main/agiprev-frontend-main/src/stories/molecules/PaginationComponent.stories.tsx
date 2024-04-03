import { PaginationComponent } from '../../components/UI/molecules/PaginationComponent/PaginationComponent';

export default {
  title: 'Molecules/PaginationComponent',
  component: PaginationComponent,
};

export const Pagination = () => (
  <PaginationComponent
    onSelectedPageChanged={() => {}}
    selectedPage={1}
    arrayLength={50}
    maxPageItens={10}
  ></PaginationComponent>
);

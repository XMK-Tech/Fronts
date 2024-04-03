import { FaFilter } from 'react-icons/fa';
import { ContentModalIconComponent } from '../ContentModalIconComponent/ContentModalIconComponent';
import ModalStructureComponent from '../ModalStructureComponent/ModalStructureComponent';
import IconButtonComponent from '../../atoms/ButtonComponent/IconButton';
import { Flex } from '@chakra-ui/react';

type FilterComponentProps = {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFilter: boolean;
  bodyFilter: React.ReactNode;
  onSearch: () => void;
  onClean: () => void;
};
export default function FilterComponent(props: FilterComponentProps) {
  return (
    <Flex>
      <IconButtonComponent
        marginX={2}
        arialLabel="Filtro"
        Icon={<FaFilter />}
        onSubmit={() => {
          props.setShowFilter(true);
        }}
      />
      <ModalStructureComponent
        isOpen={props.showFilter}
        size="xl"
        onClose={() => props.setShowFilter(false)}
        title="Filtro"
        description="Opções de filtro"
        isCentered
        children={
          <ContentModalIconComponent
            body={props.bodyFilter}
            button={{
              label: 'Pesquisar',
              onClick: () => {
                props.onSearch();
                props.setShowFilter(false);
              },
            }}
            secondaryButton={{
              label: 'Limpar Pesquisa',
              onClick: () => {
                props.onClean();
                props.setShowFilter(false); 
              },
            }}
          />
        }
      />
    </Flex>
  );
}

import { Flex } from '@chakra-ui/react';
import { ChangeEventHandler } from 'react';
import InputSelectComponent from '../../atoms/InputSelectComponent/InputSelectComponent';
import SearchComponent from '../../atoms/SearchComponent/SearchComponent';

type SearchComponentProps = {
  onChangeText?: ChangeEventHandler<HTMLInputElement>;
  selectDefaultValue?: string;
  inputValue?: string;
  onChangeSelect?: ChangeEventHandler<HTMLSelectElement>;
  onClean: () => void;
  options?: { id: string; name: string }[];
};

export default function SearchSelectComponent(props: SearchComponentProps) {
  return (
    <Flex alignItems={'center'}>
      <SearchComponent
        onChange={props.onChangeText}
        value={props.inputValue}
        onClean={props.onClean}
      />
      <InputSelectComponent
        m={'0'}
        w={'300px'}
        label=""
        defaultValue={props.selectDefaultValue}
        onChange={props.onChangeSelect}
        options={props.options}
      />
    </Flex>
  );
}

import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { ChangeEventHandler } from 'react';

type SearchComponentProps = {
  placeholder?: string;
  maxWidth?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClean?: () => void;
  value?: string;
  variant?: 'filled' | 'outline' | 'unstyled' | 'flushed';
};

export default function SearchComponent(props: SearchComponentProps) {
  return (
    <Flex>
      <InputGroup maxWidth={props.maxWidth || 300}>
        <InputLeftElement children={<SearchIcon color="gray.500" />} />
        <Input
          type="text"
          variant={props.variant || 'outline'}
          value={props.value}
          placeholder={props.placeholder || 'Busca'}
          onChange={props.onChange}
        />
        {props.onClean && (
          <InputRightElement
            cursor={'pointer'}
            onClick={props.onClean}
            children={<CloseIcon color="gray.500" />}
          />
        )}
      </InputGroup>
    </Flex>
  );
}

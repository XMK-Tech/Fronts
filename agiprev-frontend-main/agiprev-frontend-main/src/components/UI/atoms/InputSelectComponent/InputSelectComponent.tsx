import { ChangeEventHandler } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from '@chakra-ui/react';

export type InputSelectProps = {
  label: string;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  m?: string | number;
  w?: string | number;
  p?: string | number;
  marginRight?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  options?: { id: string; name: string }[];
  error?: string;
};

export default function InputSelectComponent(props: InputSelectProps) {
  return (
    <FormControl
      w={props.w}
      p={props.p}
      margin={props.m}
      isInvalid={!!props.error}
      mr={props.marginRight}
    >
      <FormLabel mb={0}>{props.label}</FormLabel>
      <Select
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        disabled={props.disabled}
      >
        {props.options?.map((option, i) => (
          <option
            selected={option.id === props.defaultValue}
            key={i}
            value={option.id}
          >
            {option.name}
          </option>
        ))}
      </Select>
      <FormErrorMessage mt={'0'}>{props.error}</FormErrorMessage>
    </FormControl>
  );
}

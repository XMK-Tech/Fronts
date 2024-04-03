import './InputComponent.scss';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  CSSProperties,
  FormEventHandler,
} from 'react';

export type InputProps = {
  className?: string;
  id?: string;
  label?: string;
  disabled?: boolean;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInput?: FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  size?: string;
  borderRadius?: number;
  style?: CSSProperties;
  w?: string | number;
  margin?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
  error?: string;
  step?: string;
  pattern?: string;
};

export default function InputComponent(props: InputProps) {
  return (
    <FormControl
      mt={props.marginTop}
      w={props.w}
      margin={props.margin}
      mb={props.marginBottom}
      mr={props.marginRight}
      ml={props.marginLeft}
      isInvalid={!!props.error}
    >
      <FormLabel mb={'0'} style={props.style}>
        {props.label}
      </FormLabel>
      {props.type === 'textArea' ? (
        <Textarea
          variant={props.variant || 'outline'}
          borderRadius={props.borderRadius}
          disabled={props.disabled}
          value={props.value}
          onChange={props.onChange}
          onInput={props.onInput}
          onKeyUp={props.onKeyUp}
          onKeyDown={props.onKeyDown}
          placeholder={props.placeholder}
          size={props.size || 'md'}
        />
      ) : (
        <Input
          step={props.step}
          variant={props.variant || 'outline'}
          borderRadius={props.borderRadius}
          disabled={props.disabled}
          value={props.value}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onInput={props.onInput}
          onKeyUp={props.onKeyUp}
          onKeyDown={props.onKeyDown}
          placeholder={props.placeholder}
          type={props.type}
          pattern={props.pattern}
          size={props.size || 'md'}
        />
      )}
      <FormErrorMessage mt={'0'}>{props.error}</FormErrorMessage>
    </FormControl>
  );
}

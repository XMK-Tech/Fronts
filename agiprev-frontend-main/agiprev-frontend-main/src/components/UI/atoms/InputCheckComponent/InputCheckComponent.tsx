import './InputCheckComponent.scss';
import { ChangeEventHandler } from 'react';
import { FormCheckType } from 'react-bootstrap/esm/FormCheck';
import { Checkbox } from '@chakra-ui/react';

export type InputCheckProps = {
  label?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: FormCheckType;
  value?: string;
  w?: string;
  m?: string;
  isChecked?: boolean;
  placeholder?: string;
  children: React.ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export default function InputCheckComponent(props: InputCheckProps) {
  return (
    <Checkbox
      className={props.className}
      id={props.id}
      size={props.size}
      onChange={props.onChange}
      type={props.type}
      value={props.value}
      w={props.w}
      m={props.m}
      isDisabled={props.disabled}
      isChecked={props.isChecked}
      placeholder={props.placeholder}
    >
      {props.children}
    </Checkbox>
  );
}

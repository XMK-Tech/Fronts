import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

export type RadioGroupProps = {
  value?: string;
  onChange?: (nextValue: string) => void;
  options?: { id: string; name: string }[];
  margin?: string | number | undefined;
  marginRadio?: string | number | undefined;
  direction?: 'row' | 'column';
};

export default function RadioGroupComponent(props: RadioGroupProps) {
  return (
    <>
      <RadioGroup
        onChange={props.onChange}
        value={props.value}
        margin={`${props.margin} !important`}
        colorScheme="brand"
      >
        <Stack spacing={10} direction={props.direction}>
          {props.options?.map((option, i) => (
            <Radio key={i} value={option.id} margin={props.marginRadio}>
              {option.name}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </>
  );
}

import { Stack } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import TextComponent from '../TextComponent/TextComponent';

export type ContractTermsProps = {
  terms?: { clause: string; paragraphs: string[] }[];
  style?: CSSProperties;
};

export default function ContractTermsComponent(props: ContractTermsProps) {
  return (
    <>
      <Stack style={props.style} margin={'20px 0 0 0'} spacing={6}>
        {props.terms?.map((term, i) => (
          <>
            <TextComponent fontSize={'20px'} fontWeight={'bold'} key={i}>
              {' '}
              {term.clause}{' '}
            </TextComponent>
            <>
              {term.paragraphs.map((paragraph, ind) => (
                <TextComponent fontSize={'16px'} key={ind}>
                  {' '}
                  {paragraph}{' '}
                </TextComponent>
              ))}
            </>
          </>
        ))}
      </Stack>
    </>
  );
}

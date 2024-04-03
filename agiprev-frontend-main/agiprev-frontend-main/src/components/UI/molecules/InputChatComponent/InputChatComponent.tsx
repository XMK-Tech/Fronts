import { Stack } from '@chakra-ui/react';
import React from 'react';
import { ChangeEventHandler } from 'react';
import Dropzone from 'react-dropzone';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import IconButtonComponent from '../../atoms/ButtonComponent/IconButton';
import InputComponent from '../../atoms/InputComponent/InputComponent';

type InputChatComponentProps = {
  onSubmitSendButton: () => void;
  onSubmitattachmentButton?: () => void;
  inputValue?: string;
  onChangeInput?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onDrop?: (acceptedFiles: any) => void;
  defaultResponses?: {
    response: string;
    onSubmitDefaultReponse: () => void;
  }[];
};

export function InputChatComponent(props: InputChatComponentProps) {
  return (
    <Stack direction={'column'} alignItems={'center'}>
      <Stack width={'87%'} direction="row">
        {props.defaultResponses?.map((e, i) => (
          <ButtonComponent
            style={{ height: 27 }}
            key={i}
            onSubmit={() => e.onSubmitDefaultReponse()}
          >
            {e.response}
          </ButtonComponent>
        ))}
      </Stack>
      <Stack alignItems={'center'} direction={'row'} width="100%">
        <Dropzone onDrop={props.onDrop}>
          {({ getRootProps, getInputProps }) => (
            <Stack {...getRootProps()}>
              <IconButtonComponent
                {...getInputProps()}
                style={{ borderRadius: 29 }}
                width={50}
                height={50}
                arialLabel="attachment button"
                onSubmit={() => props.onSubmitattachmentButton}
                Icon={<FaPaperclip />}
              />
            </Stack>
          )}
        </Dropzone>
        <InputComponent
          value={props.inputValue}
          onChange={props.onChangeInput}
          placeholder="Escreva ao Usuário"
        />
        <IconButtonComponent
          style={{ borderRadius: 29 }}
          width={57}
          height={50}
          arialLabel="send button"
          onSubmit={() => props.onSubmitSendButton()}
          Icon={<FaPaperPlane />}
        />
      </Stack>
    </Stack>
  );
}

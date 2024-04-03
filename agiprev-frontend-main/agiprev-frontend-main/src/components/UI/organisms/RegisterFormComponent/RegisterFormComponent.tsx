import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import ContainerComponent from '../../atoms/ContainerComponent/ContainerComponent';
import { CSSProperties, useState } from 'react';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { Box, Stack, useToast } from '@chakra-ui/react';
import LinkComponent from '../../atoms/LinkComponent/LinkComponent';
import { postInsertUser } from '../../../../services/LoginService';
import { showToast } from '../../../../utils/showToast';

export type RegisterFormProps = {
  style?: CSSProperties;
};

export default function RegisterFormComponent(props: RegisterFormProps) {
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <>
      <ContainerComponent style={props.style}>
        <Stack fontWeight={500} fontSize={'16px'} spacing={3}>
          <Box>
            <InputComponent
              borderRadius={15}
              id="name"
              label={'Nome'}
              type={'text'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={'Digite seu nome'}
            />
          </Box>
          <Box>
            <InputComponent
              borderRadius={15}
              id="email"
              label={'Email'}
              type={'Email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={'Digite seu email'}
            />
          </Box>
          <Box>
            <InputComponent
              borderRadius={15}
              id="password"
              label={'Senha'}
              type={'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={'Digite a senha'}
            />
          </Box>
        </Stack>
        <ButtonComponent
          style={{ marginTop: 35 }}
          width={275}
          children={'Cadastrar'}
          onSubmit={() => {
            postInsertUser({ username, email, password })
              .then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Cadastrado com sucesso, tente logar',
                });
              })
              .catch((err) => {
                console.error(err);
                showToast({
                  toast,
                  status: 'error',
                  title: 'Error',
                  description: 'Ocorreu um erro desconhecido',
                });
              });
          }}
        />
      </ContainerComponent>
      <TextComponent fontWeight={600} fontSize={'12px'}>
        Já possui uma conta?
        <LinkComponent color={'brand.500'} to={'/login'}>
          {' '}
          Faça login
        </LinkComponent>
      </TextComponent>
    </>
  );
}

import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import ContainerComponent from '../../atoms/ContainerComponent/ContainerComponent';
import { CSSProperties, useState } from 'react';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { Box, Flex, Stack, useToast } from '@chakra-ui/react';
import { postRecoverPassword } from '../../../../services/LoginService';
import { showToast } from '../../../../utils/showToast';
import LinkComponent from '../../atoms/LinkComponent/LinkComponent';
import { useNavigate } from 'react-router-dom';

export type RegisterFormProps = {
  style?: CSSProperties;
  isFirstAccess: boolean;
};

export default function ForgotPasswordFormComponent(props: RegisterFormProps) {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  return (
    <>
      <ContainerComponent style={props.style}>
        <Stack fontWeight={'500'} fontSize={'16px'} spacing={1}>
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
        </Stack>
        <ButtonComponent
          style={{ marginTop: 35 }}
          width={275}
          children={'Enviar'}
          onSubmit={() => {
            postRecoverPassword({ email, isFirstAccess: props.isFirstAccess })
              .then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Verifique seu email',
                });
                navigate('/change-password');
              })
              .catch((err) => {
                console.error(err);
                showToast({
                  toast,
                  status: 'error',
                  title: 'Error',
                  description: 'Email não cadastrado',
                });
              });
          }}
        />
      </ContainerComponent>
      <Flex mt={'4%'}>
        <TextComponent fontWeight={600} fontSize={'12px'}>
          Já possui cadastro?
          <LinkComponent color={'brand.500'} to={'/login'}>
            Faça login
          </LinkComponent>
        </TextComponent>
      </Flex>
    </>
  );
}

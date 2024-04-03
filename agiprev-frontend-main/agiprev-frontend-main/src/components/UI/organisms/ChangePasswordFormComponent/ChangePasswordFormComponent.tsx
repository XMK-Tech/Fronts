import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import ContainerComponent from '../../atoms/ContainerComponent/ContainerComponent';
import { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { Box, Link, Stack, useToast } from '@chakra-ui/react';
import { postSetPassword } from '../../../../services/LoginService';
import { showToast } from '../../../../utils/showToast';
import { getError } from '../../../../utils/functions/utility';
import LinkComponent from '../../atoms/LinkComponent/LinkComponent';
import InputCheckComponent from '../../atoms/InputCheckComponent/InputCheckComponent';

export type RegisterFormProps = {
  style?: CSSProperties;
  tokenScreen: number;
  setTokenScreen: Dispatch<SetStateAction<number>>;
  termsAndConditions: boolean;
};

export default function ChangePasswordFormComponent(props: RegisterFormProps) {
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [username, setUsername] = useState('');
  const [setPasswordToken, setSetPasswordToken] = useState('');
  const [setPasswordTokenConfirm, setSetPasswordTokenConfirm] = useState('');

  function validToken() {
    if (!setPasswordToken || setPasswordToken !== setPasswordTokenConfirm)
      return false;
    return true;
  }

  function validPassword() {
    if (!password || password !== passwordConfirm) return false;
    return true;
  }

  return (
    <>
      <ContainerComponent style={props.style}>
        {props.tokenScreen === 0 && (
          <Box>
            <Stack fontWeight={'500'} fontSize={'16px'} spacing={3}>
              <InputComponent
                borderRadius={15}
                id="token"
                label={'Token'}
                type={'password'}
                value={setPasswordToken}
                onChange={(e) => setSetPasswordToken(e.target.value)}
                placeholder={'Digite o token'}
              />
              <InputComponent
                borderRadius={15}
                id="token"
                label={'Confirmar Token'}
                type={'password'}
                value={setPasswordTokenConfirm}
                onChange={(e) => setSetPasswordTokenConfirm(e.target.value)}
                placeholder={'Confirme o token'}
                error={!validToken() ? 'Confirme os dois campos' : undefined}
              />
            </Stack>
            <ButtonComponent
              disabled={!validToken()}
              style={{ marginTop: 35 }}
              width={275}
              onSubmit={() => {
                props.setTokenScreen(1);
              }}
            >
              Avançar
            </ButtonComponent>
          </Box>
        )}
        {props.tokenScreen === 1 && (
          <Box>
            <Stack fontWeight={'500'} fontSize={'16px'} spacing={3}>
              <InputComponent
                borderRadius={15}
                id="username"
                label={'Email'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={'Digite seu email'}
              />
              <InputComponent
                borderRadius={15}
                id="password"
                label={'Senha'}
                type={'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={'Digite a senha'}
              />
              <InputComponent
                borderRadius={15}
                id="password"
                label={'Confirmar Senha'}
                type={'Password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder={'Confirme a senha'}
                error={!validPassword() ? 'Confirme os dois campos' : undefined}
              />
            </Stack>
            <ButtonComponent
              disabled={!validPassword()}
              style={{ marginTop: 35 }}
              width={275}
              onSubmit={() => {
                if (!props.termsAndConditions) {
                  postSetPassword({ password, username, setPasswordToken })
                    .then((res) => {
                      showToast({
                        toast,
                        status: 'success',
                        title: 'Sucesso',
                        description: 'Senha alterada com sucesso, tente Logar',
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                      showToast({
                        toast,
                        status: 'error',
                        title: 'Error',
                        description: getError(err),
                      });
                    });
                } else {
                  props.setTokenScreen(2);
                }
              }}
            >
              {!props.termsAndConditions ? 'Salvar' : 'Avançar'}
            </ButtonComponent>
          </Box>
        )}
        {props.tokenScreen === 2 && (
          <Box>
            <Stack fontWeight={'500'} fontSize={'16px'} spacing={3}>
              <InputCheckComponent
                isChecked={checkedTerms}
                onChange={() => setCheckedTerms(!checkedTerms)}
              >
                <TextComponent fontWeight={'normal'} lineHeight={1}>
                  Li e estou de acordo com os{' '}
                  <Link
                    href=""
                    target="_blank"
                    colorScheme="red"
                    textColor={'red'}
                    textDecoration={'underline'}
                    _hover={{ color: 'red' }}
                  >
                    Termos de Uso e Política de Privacidade
                  </Link>
                </TextComponent>
              </InputCheckComponent>
            </Stack>
            <ButtonComponent
              disabled={!checkedTerms}
              style={{ marginTop: 35 }}
              width={275}
              onSubmit={() => {
                postSetPassword({ password, username, setPasswordToken })
                  .then((res) => {
                    showToast({
                      toast,
                      status: 'success',
                      title: 'Sucesso',
                      description: 'Senha alterada com sucesso, tente Logar',
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                    showToast({
                      toast,
                      status: 'error',
                      title: 'Error',
                      description: getError(err),
                    });
                  });
              }}
            >
              Cadastrar
            </ButtonComponent>
          </Box>
        )}
      </ContainerComponent>
      <TextComponent fontWeight={600} fontSize={'12px'}>
        Ja criou sua conta?
        <LinkComponent color={'brand.500'} to={'/login'}>
          {' '}
          Faça login
        </LinkComponent>
      </TextComponent>
    </>
  );
}

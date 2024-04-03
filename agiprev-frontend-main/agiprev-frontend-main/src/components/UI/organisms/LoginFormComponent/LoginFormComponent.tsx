import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import ContainerComponent from '../../atoms/ContainerComponent/ContainerComponent';
import useLogin, {
  postLoginIcp,
  useUserData,
} from '../../../../services/LoginService';
import { CSSProperties, useEffect, useState } from 'react';
import InputCheckComponent from '../../atoms/InputCheckComponent/InputCheckComponent';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import LinkComponent from '../../atoms/LinkComponent/LinkComponent';
import ModalStructureComponent from '../../molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../molecules/ContentModalIconComponent/ContentModalIconComponent';
import { useNavigate } from 'react-router-dom';

export type LoginFormProps = {
  style?: CSSProperties;
};

export default function LoginFormComponent(props: LoginFormProps) {
  const { login, isLoading } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  useUserData();
  const navigate = useNavigate();

  const certificateKey = process.env.REACT_APP_CERTIFICATE_KEY || '';
  const certificateUrl = process.env.REACT_APP_CERTIFICATE_URL || '';

  useEffect(() => {
    if (window.location.href.includes(certificateKey)) {
      postLoginIcp().catch(() => setShowModal(true));
    }
  }, [certificateKey]);

  return (
    <>
      <ContainerComponent style={props.style}>
        <Stack mb={'20%'} fontWeight={'500'} fontSize={'16px'} spacing={1}>
          <Box mb={'11px'}>
            <InputComponent
              borderRadius={15}
              id="email"
              label={'Email'}
              type={'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={'Digite o email'}
            />
          </Box>
          <InputComponent
            borderRadius={15}
            id="password"
            label={'Senha'}
            type={'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={'Digite a senha'}
          />
          <Flex
            justifyContent={'space-between'}
            pb={'10px'}
            pt={'20px'}
            fontWeight={500}
          >
            <Box>
              <InputCheckComponent>
                <p>Lembrar-me</p>
              </InputCheckComponent>
            </Box>
            <Box>
              <LinkComponent to="/forgot-password">
                Esqueci a senha
              </LinkComponent>
            </Box>
          </Flex>
          <Flex justifyContent={'center'} pb={'10px'} fontWeight={500}>
            <Box>
              <LinkComponent to="/first-access">Primeiro acesso</LinkComponent>
            </Box>
          </Flex>
          <ButtonComponent
            width={'100%'}
            isLoading={isLoading}
            disabled={isLoading}
            children={'Entrar'}
            onSubmit={() => {
              login({ email, password });
            }}
          />
          <Link href={certificateUrl}>
            <ButtonComponent
              width={'100%'}
              style={{ marginTop: 8 }}
              isLoading={false}
              disabled={false}
              children={'Acessar com certificado digital'}
              onSubmit={() => {}}
            />
          </Link>
        </Stack>
        <Flex>
          <TextComponent fontWeight={'600'} fontSize={'12px'}>
            Recebeu o token de acesso?
            <LinkComponent color={'brand.500'} to={'/register'}>
              Complete seu cadastro
            </LinkComponent>
          </TextComponent>
        </Flex>
      </ContainerComponent>

      <ModalStructureComponent
        title="Cadastro não completado"
        isOpen={showModal}
        children={
          <ContentModalIconComponent
            iconStatus="error"
            title="Completar cadastro"
            subTitle="Complete seu cadastro antes de acessar com certificado digital."
            button={{
              onClick: () => {
                navigate('/login');
                setShowModal(false);
              },
              label: 'Completar',
            }}
            secondaryButton={{
              onClick: () => {
                navigate('/login');
                setShowModal(false);
              },
              label: 'Cancelar',
            }}
          />
        }
        size="xl"
        onClose={() => {
          navigate('/login');
          setShowModal(false);
        }}
        isCentered
      />
    </>
  );
}

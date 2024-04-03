import React, { useState } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import * as yup from 'yup';
import {
  putEnableAgiprevUser,
  usePersonsDetails,
} from '../../../../services/PersonService';
import { User } from '../../../../services/userService';
import { checkFormValue, getError } from '../../../../utils/functions/utility';
import FlexRegisterInputsComponent from '../../atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import RegisterStructureComponent from '../../molecules/RegisterStructureComponent/RegisterStructureComponent';
import { showToast } from '../../../../utils/showToast';
import { ContentModalIconComponent } from '../../molecules/ContentModalIconComponent/ContentModalIconComponent';
import ModalStructureComponent from '../../molecules/ModalStructureComponent/ModalStructureComponent';
import { useNavigate } from 'react-router-dom';
import {
  createRelationUser,
  useAccessProfileSelect,
} from '../../../../services/AccessProfileService';
import { useUserData } from '../../../../services/LoginService';
import InputSelectComponent from '../../atoms/InputSelectComponent/InputSelectComponent';
import { postOperator } from '../../../../services/OperatorService';
import { cpfMask } from '../../../../utils/functions/masks';

const formSchema = yup.object().shape({
  fullName: yup.string().required('Nome é obrigatório'),
  email: yup.string().required('Email é obrigatório'),
  document: yup.string().required('CPF é obrigatório'),
  agiprevCode: yup.string().required('Código é obrigatório'),
});

export type UserFormProps = {
  id?: string;
  isEnableAgiprevUser?: boolean;
};

export default function UserFormComponent(props: UserFormProps) {
  const defaultForm = {
    fullName: '',
    email: '',
    document: '',
    agiprevCode: '',
  };
  const [form, setForm] = React.useState<User>({ ...defaultForm });
  const [profile, setProfile] = React.useState<string>('');
  const toast = useToast();
  const navigate = useNavigate();
  const user = useUserData();
  const [showModal, setShowModal] = useState(false);
  const profileList = useAccessProfileSelect();
  const person = usePersonsDetails(props.id || '');
  React.useEffect(() => {
    if (person.data) {
      setForm({
        fullName: person.data.name,
        email: person.data.emails[0],
        document: person.data.document,
        agiprevCode: person.data.agiPrevCode,
      });
    }
  }, [person.data]);

  return (
    <>
      <RegisterStructureComponent
        title={'Cadastrar Usuário'}
        subTitle={'preencha os dados para realizar o cadastro '}
        buttonTitle={'Cadastrar'}
        goBack="user"
        disabledButton={!formSchema.isValidSync(form)}
        onSubmit={async () => {
          if (props.isEnableAgiprevUser)
            putEnableAgiprevUser(
              {
                name: form.fullName,
                email: form.email,
                document: form.document,
                agiPrevCode: form.agiprevCode,
              },
              props.id || ''
            )
              .then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Usuário criado com sucesso',
                });
                if (profile && user?.entity) {
                  createRelationUser({
                    profileId: profile,
                    userId: res.data.content.data.userId,
                    franchiseId: null,
                    entityId: user.entity,
                  });
                }
                setForm({ ...defaultForm });
                setShowModal(true);
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
          else {
            const resOperator = await postOperator({
              name: form.fullName,
              email: form.email,
              document: form.document,
              agiPrevCode: form.agiprevCode,
            });
            putEnableAgiprevUser(
              {
                name: form.fullName,
                email: form.email,
                document: form.document,
                agiPrevCode: form.agiprevCode,
              },
              resOperator.personId
            )
              .then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Usuário criado com sucesso',
                });
                if (profile && user?.entity) {
                  createRelationUser({
                    profileId: profile,
                    userId: res.data.content.data.userId,
                    franchiseId: null,
                    entityId: user.entity,
                  });
                }
                setForm({ ...defaultForm });
                setShowModal(true);
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
          }
        }}
        content={
          <Flex flexDirection={'column'} w={'100%'}>
            <TitleTextComponent mb={2} subTitle>
              Dados
            </TitleTextComponent>
            <FlexRegisterInputsComponent>
              <InputComponent
                marginRight={8}
                label="Código"
                placeholder="Digite o Código"
                value={form.agiprevCode}
                error={checkFormValue(form, formSchema, 'agiprevCode')}
                onChange={(input) => {
                  setForm({ ...form, agiprevCode: input.target.value });
                }}
              />
              <InputComponent
                marginRight={8}
                label="CPF"
                placeholder="Digite o CPF"
                value={form.document}
                error={checkFormValue(form, formSchema, 'document')}
                onChange={(input) => {
                  setForm({ ...form, document: cpfMask(input.target.value) });
                }}
              />
              <InputComponent
                marginRight={8}
                label="E-mail"
                placeholder="Digite o E-mail"
                value={form.email}
                error={checkFormValue(form, formSchema, 'email')}
                onChange={(input) => {
                  setForm({ ...form, email: input.target.value });
                }}
              />
            </FlexRegisterInputsComponent>
            <FlexRegisterInputsComponent justifyContent="left">
              <InputComponent
                marginRight={8}
                label="Nome"
                placeholder="Digite o nome "
                w={'31.2%'}
                value={form.fullName}
                error={checkFormValue(form, formSchema, 'fullName')}
                onChange={(input) => {
                  setForm({
                    ...form,
                    fullName: input.target.value,
                  });
                }}
              />
              <InputSelectComponent
                marginRight={8}
                label="Perfil"
                placeholder="Selecione o perfil"
                w={'31.2%'}
                value={profile}
                onChange={(input) => {
                  setProfile(input.target.value);
                }}
                options={profileList.data}
              />
            </FlexRegisterInputsComponent>
          </Flex>
        }
      />
      <ModalStructureComponent
        title="Token de acesso"
        isOpen={showModal}
        children={
          <ContentModalIconComponent
            iconStatus="success"
            title="Usuário cadastrado com sucesso"
            subTitle="Realize o primeiro acesso"
            button={{
              onClick: () => {
                setShowModal(false);
                navigate('/user');
              },
              label: 'Ok',
            }}
          />
        }
        size="xl"
        onClose={() => setShowModal(false)}
        isCentered
      />
    </>
  );
}

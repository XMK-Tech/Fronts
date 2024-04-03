import React from 'react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import { Flex, useToast } from '@chakra-ui/react';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import * as yup from 'yup';
import { checkFormValue, getError } from '../../../utils/functions/utility';
import { showToast } from '../../../utils/showToast';
import RadioGroupComponent from '../../UI/atoms/RadioGroupComponent/RadioGroupComponent';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import {
  RegisterPersonResp,
  postServer,
  useServerCategoriesList,
} from '../../../services/Server';
import { postOperator } from '../../../services/OperatorService';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import ModalStructureComponent from '../../UI/molecules/ModalStructureComponent/ModalStructureComponent';
import { ContentModalIconComponent } from '../../UI/molecules/ContentModalIconComponent/ContentModalIconComponent';
import { useNavigate } from 'react-router-dom';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import { cpfMask } from '../../../utils/functions/masks';

export enum RegisterType {
  operators = '1',
  servers = '2',
}

const FormOperatorRequired = {
  name: yup.string().required('Nome é obrigatório'),
  document: yup.string().required('CPF é obrigatório'),
  email: yup.string().required('Email é obrigatório'),
  agiPrevCode: yup.string().required('Código é obrigatório'),
};

export default function PersonRegisterTemplateCommponent() {
  const [showModal, setShowModal] = React.useState(false);
  const [serverOrOperatorsId, setServerOrOperatorsId] = React.useState('');
  const { data: categories } = useServerCategoriesList();
  const categoriesOptions = categories?.map((e) => ({
    id: String(e.value),
    name: e.descricao,
  }));

  const navigate = useNavigate();

  const defaultForm = {
    registerType: RegisterType.operators,
    name: '',
    document: '',
    email: '',
    agiPrevCode: '',
    admissionDate: '',
    ctpsNumber: '',
    ctpsSeries: '',
    registration: '',
    serverCategory: 0,
    pisPasepNumber: '',
  };
  const [form, setForm] = React.useState<RegisterPersonResp>({
    ...defaultForm,
  });
  const toast = useToast();

  const postOperatorOptions = {
    name: form.name,
    agiPrevCode: form.agiPrevCode,
    document: form.document,
    email: form.email,
  };

  const formSchema =
    form.registerType === RegisterType.operators
      ? yup.object().shape(FormOperatorRequired)
      : yup.object().shape({
          ...FormOperatorRequired,
          admissionDate: yup
            .string()
            .required('Data de admissão é obrigatório'),
          ctpsNumber: yup.string().required('Número do CTPS é obrigatório'),
          ctpsSeries: yup.string().required('Série do CTPS é obrigatório'),
          registration: yup.string().required('Matricula é obrigatório'),
          serverCategory: yup
            .string()
            .required('Categoria do servidor é obrigatório'),
          pisPasepNumber: yup
            .string()
            .required('Número do PIS/PASEP. é obrigatório'),
        });

  const OperatorsInputs = (
    <Flex flexDirection={'column'} w={'100%'}>
      <FlexRegisterInputsComponent>
        <InputComponent
          marginRight={8}
          label="Código"
          placeholder="Digite o código"
          value={form.agiPrevCode}
          error={checkFormValue(form, formSchema, 'agiPrevCode')}
          onChange={(input) => {
            setForm({ ...form, agiPrevCode: input.target.value });
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
      <FlexRegisterInputsComponent>
        <InputComponent
          marginRight={8}
          label="Nome"
          placeholder="Digite o nome"
          w={form.registerType === RegisterType.operators ? '31.2%' : undefined}
          value={form.name}
          error={checkFormValue(form, formSchema, 'name')}
          onChange={(input) => {
            setForm({ ...form, name: input.target.value });
          }}
        />
        {form.registerType !== RegisterType.operators && (
          <>
            <InputComponent
              marginRight={8}
              type="date"
              label="Data de admissão"
              value={form.admissionDate}
              error={checkFormValue(form, formSchema, 'admissionDate')}
              onChange={(input) => {
                setForm({ ...form, admissionDate: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Número do CTPS"
              placeholder="Digite o número do CTPS"
              value={form.ctpsNumber}
              error={checkFormValue(form, formSchema, 'ctpsNumber')}
              onChange={(input) => {
                setForm({ ...form, ctpsNumber: input.target.value });
              }}
            />
          </>
        )}
      </FlexRegisterInputsComponent>
    </Flex>
  );

  const ServersInputs = (
    <>
      {OperatorsInputs}
      <Flex flexDirection={'column'} w={'100%'}>
        <FlexRegisterInputsComponent>
          <InputComponent
            marginRight={8}
            label="Série do CTPS"
            placeholder="Digite a série do CTPS"
            value={form.ctpsSeries}
            error={checkFormValue(form, formSchema, 'ctpsSeries')}
            onChange={(input) => {
              setForm({ ...form, ctpsSeries: input.target.value });
            }}
          />
          <InputComponent
            marginRight={8}
            label="Matricula"
            placeholder="Digite a matrícula"
            value={form.registration}
            error={checkFormValue(form, formSchema, 'registration')}
            onChange={(input) => {
              setForm({ ...form, registration: input.target.value });
            }}
          />
          <InputSelectComponent
            marginRight={8}
            error={checkFormValue(form, formSchema, 'serverCategory')}
            value={String(form.serverCategory)}
            onChange={(input) =>
              setForm({
                ...form,
                serverCategory: Number(input.target.value),
              })
            }
            options={categoriesOptions}
            placeholder="Categoria do servidor"
            label="Categoria do servidor"
          />
        </FlexRegisterInputsComponent>
        <FlexRegisterInputsComponent>
          <InputComponent
            marginRight={8}
            w={'31.2%'}
            label="Número do PIS/PASEP."
            placeholder="Digite o número do PIS/PASEP"
            value={form.pisPasepNumber}
            error={checkFormValue(form, formSchema, 'pisPasepNumber')}
            onChange={(input) => {
              setForm({ ...form, pisPasepNumber: input.target.value });
            }}
          />
        </FlexRegisterInputsComponent>
      </Flex>
    </>
  );

  return (
    <>
      <RegisterStructureComponent
        title="Cadastro de Pessoas"
        subTitle="preencha os dados para realizar o cadastro "
        buttonTitle="Cadastrar"
        disabledButton={!formSchema.isValidSync(form)}
        goBack="person"
        onSubmitGoBack={() => {
          setForm({ ...defaultForm });
        }}
        onSubmit={async () => {
          try {
            if (form.registerType === RegisterType.operators) {
              const resOperator = await postOperator({
                ...postOperatorOptions,
              });
              showToast({
                toast,
                status: 'success',
                title: 'Sucesso',
                description: 'sucesso',
              });
              setForm({ ...defaultForm });
              setShowModal(true);
              setServerOrOperatorsId(resOperator.personId);
            } else {
              const resServer = await postServer({
                ...postOperatorOptions,
                admissionDate: form.admissionDate,
                ctpsNumber: form.ctpsNumber,
                ctpsSeries: form.ctpsSeries,
                registration: form.registration,
                serverCategory: form.serverCategory,
                pisPasepNumber: form.pisPasepNumber,
              });
              showToast({
                toast,
                status: 'success',
                title: 'Sucesso',
                description: 'sucesso',
              });
              setForm({ ...defaultForm });
              setShowModal(true);
              setServerOrOperatorsId(resServer.personId);
            }
          } catch (err) {
            console.error(err);
            showToast({
              toast,
              status: 'error',
              title: 'Error',
              description: getError(err),
            });
          }
        }}
        content={
          <Flex flexDirection={'column'} w={'100%'}>
            <TitleTextComponent mb={2} subTitle>
              Selecione o tipo de cadastro
            </TitleTextComponent>
            <RadioGroupComponent
              onChange={(value) => {
                setForm({ ...form, registerType: value as RegisterType });
              }}
              value={form.registerType}
              margin={'26px 0 26px 0'}
              options={[
                { id: RegisterType.operators, name: 'Cadastro de Operadores' },
                { id: RegisterType.servers, name: 'Cadastro de Servidores' },
              ]}
              direction={'row'}
            />
            <TitleTextComponent mb={5} subTitle>
              Dados
            </TitleTextComponent>
            <Flex
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {form.registerType === RegisterType.operators ? (
                OperatorsInputs
              ) : (
                <>{ServersInputs}</>
              )}
            </Flex>
          </Flex>
        }
      />
      <ModalStructureComponent
        title="Token de acesso"
        isOpen={showModal}
        children={
          <ContentModalIconComponent
            iconStatus="success"
            title="Cadastro realizado com SUCESSO"
            subTitle="Parabéns ...
            seu cadastro foi efetuado com sucesso
            agora você pode gerar seu usuário de acesso"
            button={{
              onClick: () => {
                setShowModal(false);
                navigate(`/enable-agiprev-user/${serverOrOperatorsId}`);
              },
              label: 'Gerar o usuário de acesso',
            }}
          />
        }
        size="xl"
        onClose={() => {
          setShowModal(false);
          navigate('/person');
        }}
        isCentered
      />
    </>
  );
}

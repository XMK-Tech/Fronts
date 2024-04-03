import React from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import { checkFormValue, getError } from '../../../utils/functions/utility';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import { showToast } from '../../../utils/showToast';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Rubric,
  RubricAccountOriginOfBalance,
  RubricAccountStatus,
  RubricAccounts,
  saveRubric,
  useRubricAcountsId,
  useRubricDetails,
} from '../../../services/RubricService';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';

const defaultForm = {
  account: '',
  title: '',
  function: '',
  detail: '',
  status: 0,
  originOfBalance: 0,
  classifications: '',
};

const formSchema = yup.object().shape({
  account: yup.string().required('Conta/ Código é obrigatório'),
  title: yup.string().required('Título/ Descrição é obrigatório'),
  function: yup.string().required('Função é obrigatório'),
  detail: yup.string().required('Nível de detalhamento é obrigatório'),
  status: yup.number().required('Status é obrigatório'),
  originOfBalance: yup.number().required('Natureza de saldo é obrigatório'),
  classifications: yup.string().required('Classificação é obrigatório'),
});

export default function RubricAccountRegisterTemplateComponent() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id: string; account: string }>();
  const [form, setForm] = React.useState<RubricAccounts>({ ...defaultForm });
  const [rubricData, setRubricData] = React.useState<Rubric>({
    name: '',
    stateId: '',
    reference: '',
    accounts: [],
  });
  const rubric = useRubricDetails(params.id || '');
  const accounts = useRubricAcountsId(params.id || '');
  React.useEffect(() => {
    if (rubric.data && accounts.data) {
      const account = accounts.data.data.find(
        (item) => item.id === params.account
      );
      if (account?.id) {
        setForm({
          id: account.id,
          account: account.account,
          title: account.title,
          function: account.function,
          detail: account.detail,
          status: account.status,
          originOfBalance: account.originOfBalance,
          classifications: account.classifications,
        });
        setRubricData({
          ...rubric.data,
          accounts: accounts.data.data.filter((item) => item.id !== account.id),
        });
      } else {
        setRubricData({
          ...rubric.data,
          accounts: accounts.data.data,
        });
      }
    }
  }, [accounts.data, params.account, rubric.data]);
  return (
    <RegisterStructureComponent
      title={!params.account ? 'Cadastro de Conta' : 'Editar Conta'}
      subTitle="preencha os dados para realizar o cadastro "
      buttonTitle={!params.account ? 'Cadastrar' : 'Editar'}
      goBack={`rubric-details/${params.id}`}
      disabledButton={!formSchema.isValidSync(form)}
      onSubmit={() => {
        saveRubric({
          ...rubricData,
          accounts: [...(rubricData.accounts || []), { ...form }],
        })
          .then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: !params.account
                ? 'Conta criada com sucesso'
                : 'Conta editada com sucesso',
            });
            navigate(`/rubric-details/${params.id}`);
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
      content={
        <Flex flexDirection={'column'} w={'100%'}>
          <TitleTextComponent mb={2} subTitle>
            Conta
          </TitleTextComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="Conta/ Código"
              placeholder="Digite a conta/ código"
              value={form.account}
              error={checkFormValue(form, formSchema, 'account')}
              onChange={(input) => {
                setForm({ ...form, account: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Título/ Descrição"
              placeholder="Digite o título/ descrição"
              value={form.title}
              error={checkFormValue(form, formSchema, 'title')}
              onChange={(input) => {
                setForm({ ...form, title: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Função"
              placeholder="Digite a função"
              value={form.function}
              error={checkFormValue(form, formSchema, 'function')}
              onChange={(input) => {
                setForm({ ...form, function: input.target.value });
              }}
            />
          </FlexRegisterInputsComponent>
          <FlexRegisterInputsComponent>
            <InputSelectComponent
              marginRight={8}
              label="Natureza do saldo"
              placeholder="Selecione a natureza do saldo"
              defaultValue={form.originOfBalance.toString()}
              options={[
                {
                  id: `${RubricAccountOriginOfBalance.Debit}`,
                  name: 'Débito',
                },
                {
                  id: `${RubricAccountOriginOfBalance.Credit}`,
                  name: 'Crédito',
                },
              ]}
              error={checkFormValue(form, formSchema, 'originOfBalance')}
              onChange={(input) => {
                setForm({
                  ...form,
                  originOfBalance: Number(input.target.value),
                });
              }}
            />
            <InputSelectComponent
              marginRight={8}
              label="Status"
              placeholder="Selecione o Status"
              defaultValue={form.status.toString()}
              options={[
                { id: `${RubricAccountStatus.Active}`, name: 'Ativo' },
                { id: `${RubricAccountStatus.Inactive}`, name: 'Inativo' },
              ]}
              error={checkFormValue(form, formSchema, 'status')}
              onChange={(input) => {
                setForm({ ...form, status: Number(input.target.value) });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Nível de detalhamento"
              placeholder="Digite o nível de detalhamento"
              value={form.detail}
              error={checkFormValue(form, formSchema, 'detail')}
              onChange={(input) => {
                setForm({ ...form, detail: input.target.value });
              }}
            />
          </FlexRegisterInputsComponent>
          <FlexRegisterInputsComponent>
            <InputSelectComponent
              marginRight={8}
              label="Classificação"
              placeholder="Selecione a Classificação"
              defaultValue={form.classifications?.toString()}
              error={checkFormValue(form, formSchema, 'classifications')}
              options={[
                { id: `Dedução`, name: 'Dedução' },
                { id: `Retenção`, name: 'Retenção' },
              ]}
              onChange={(input) => {
                setForm({
                  ...form,
                  classifications: input.target.value,
                });
              }}
            />
          </FlexRegisterInputsComponent>
        </Flex>
      }
    />
  );
}

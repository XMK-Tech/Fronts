import React from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import {
  checkFormValue,
  getError,
  parseMonth,
} from '../../../utils/functions/utility';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import { showToast } from '../../../utils/showToast';
import * as yup from 'yup';
import {
  Expense,
  expenseTypeOptions,
  saveExpense,
  useExpenseDetails,
} from '../../../services/ExpenseService';
import { useNavigate, useParams } from 'react-router-dom';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import { cleanMoneyMask, moneyMask } from '../../../utils/functions/masks';
import { useUserData } from '../../../services/LoginService';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';

const defaultForm = {
  type: 0,
  description: '',
  year: '',
  pasep: '',
  index: 0,
  value: '',
  reference: '',
};

const formSchema = yup.object().shape({
  type: yup.number().required('Tipo é obrigatório'),
  description: yup.string().required('Credor é obrigatório'),
  year: yup.string().required('Ano é obrigatório'),
  pasep: yup.string().required('Empenho é obrigatório'),
  index: yup.number().required('ID é obrigatório'),
  value: yup.string().required('Valor é obrigatório'),
  reference: yup.string().required('Competência é obrigatório'),
});

export default function ExpenseRegisterTemplateComponent() {
  const user = useUserData();
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [form, setForm] = React.useState<Expense>({
    ...defaultForm,
    year: user?.year || '',
  });
  const expense = useExpenseDetails(params.id || '');
  React.useEffect(() => {
    if (expense.data && params.id) {
      setForm({
        id: expense.data.id,
        type: expense.data.type,
        description: expense.data.description,
        year: expense.data.year,
        pasep: expense.data.pasep,
        index: expense.data.index,
        value: moneyMask(expense.data.value.toString()),
        reference: parseMonth(expense.data.reference),
      });
    }
  }, [expense.data, params.id]);
  return (
    <RegisterStructureComponent
      title={!params.id ? 'Cadastrar Despesa' : 'Editar Despesa'}
      subTitle="preencha os dados para realizar o cadastro "
      buttonTitle={!params.id ? 'Cadastrar' : 'Editar'}
      goBack="expense"
      disabledButton={!formSchema.isValidSync(form)}
      onSubmit={() => {
        saveExpense({
          ...form,
          value: cleanMoneyMask(String(form.value)),
        })
          .then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: !params.id
                ? 'Despesa criada com sucesso'
                : 'Despesa editada com sucesso',
            });
            navigate('/expense');
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
            Dados
          </TitleTextComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="Index"
              placeholder="Digite o index"
              value={form.index.toString()}
              error={checkFormValue(form, formSchema, 'index')}
              onChange={(input) => {
                setForm({
                  ...form,
                  index: Number(input.target.value),
                });
              }}
            />
            <InputSelectComponent
              marginRight={8}
              label="Tipo"
              placeholder="Selecione o tipo"
              defaultValue={form.type.toString()}
              options={expenseTypeOptions}
              error={checkFormValue(form, formSchema, 'type')}
              onChange={(input) => {
                setForm({ ...form, type: Number(input.target.value) });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Empenho"
              placeholder="Digite o empenho"
              value={form.pasep.toString()}
              error={checkFormValue(form, formSchema, 'pasep')}
              onChange={(input) => {
                setForm({
                  ...form,
                  pasep: input.target.value,
                });
              }}
            />
          </FlexRegisterInputsComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="Credor"
              placeholder="Digite o Credor"
              value={form.description}
              error={checkFormValue(form, formSchema, 'description')}
              onChange={(input) => {
                setForm({ ...form, description: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Ano"
              placeholder="Digite o ano"
              value={form.year}
              error={checkFormValue(form, formSchema, 'year')}
              onChange={(input) => {
                setForm({ ...form, year: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Competência"
              placeholder="Digite a competência"
              type="month"
              value={form.reference}
              error={checkFormValue(form, formSchema, 'reference')}
              onChange={(input) => {
                setForm({ ...form, reference: input.target.value });
              }}
            />
          </FlexRegisterInputsComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              w={'31.2%'}
              label="Valor"
              placeholder="Digite o Valor Pago"
              value={form.value.toString()}
              error={checkFormValue(form, formSchema, 'value')}
              onChange={(input) => {
                setForm({
                  ...form,
                  value: moneyMask(input.target.value, true),
                });
              }}
            />
          </FlexRegisterInputsComponent>
        </Flex>
      }
    />
  );
}

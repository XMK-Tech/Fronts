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
import {
  Revenue,
  saveRevenue,
  useRevenueId,
} from '../../../services/RevenueService';
import { showToast } from '../../../utils/showToast';
import * as yup from 'yup';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { cleanMoneyMask, moneyMask } from '../../../utils/functions/masks';

export default function RevenueRegisterTemplateComponent() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const defaultForm = {
    account: '',
    reference: '',
    description: '',
    predictedValue: '',
    predictedDeductions: '',
    predictedUpdated: '',
    collection: '',
    deductions: '',
    effectedValue: '',
  };
  const [form, setForm] = React.useState<Revenue>({ ...defaultForm });
  const formSchema = yup.object().shape({
    account: yup.string().required('Conta é obrigatório'),
    description: yup.string().required('Receita é obrigatório'),
    predictedValue: yup.string().required('Previsão Inicial é obrigatório'),
    predictedDeductions: yup
      .string()
      .required('Previsão de Dedução é obrigatório'),
    predictedUpdated: yup
      .string()
      .required('Previsão Atualizada é obrigatório'),
    collection: yup.string().required('Arrecadação é obrigatório'),
    deductions: yup.string().required('Dedução é obrigatório'),
    effectedValue: yup.string().required('Arrecadação Líquida é obrigatório'),
    reference: yup.string().required('Competência é obrigatório'),
  });
  const revenue = useRevenueId(params.id || '');

  React.useEffect(() => {
    if (revenue.data) {
      setForm({
        id: revenue.data.id,
        account: revenue.data.account,
        description: revenue.data.description,
        predictedValue: moneyMask(String(revenue.data.predictedValue)),
        predictedDeductions: moneyMask(
          String(revenue.data.predictedDeductions)
        ),
        predictedUpdated: moneyMask(String(revenue.data.predictedUpdated)),
        collection: moneyMask(String(revenue.data.collection)),
        deductions: moneyMask(String(revenue.data.deductions)),
        effectedValue: moneyMask(String(revenue.data.effectedValue)),
        reference: parseMonth(revenue.data.reference),
      });
    }
  }, [revenue.data]);

  return (
    <RegisterStructureComponent
      title={!params.id ? 'Cadastrar Receita' : 'Editar Receita'}
      subTitle={
        !params.id
          ? 'preencha os dados para realizar o cadastro '
          : 'você pode editar as informações'
      }
      buttonTitle={!params.id ? 'Cadastrar' : 'Editar'}
      goBack="revenues"
      disabledButton={!formSchema.isValidSync(form)}
      onSubmit={() => {
        saveRevenue({
          ...form,
          collection: cleanMoneyMask(String(form.collection)),
          deductions: cleanMoneyMask(String(form.deductions)),
          effectedValue: cleanMoneyMask(String(form.effectedValue)),
          predictedDeductions: cleanMoneyMask(String(form.predictedDeductions)),
          predictedUpdated: cleanMoneyMask(String(form.predictedUpdated)),
          predictedValue: cleanMoneyMask(String(form.predictedValue)),
        })
          .then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: !params.id
                ? 'Receita criada com sucesso'
                : 'Receita editada com sucesso',
            });
            setForm({
              ...defaultForm,
            });
            navigate('/revenues');
          })
          .catch((err) => {
            console.error(err);
            showToast({
              toast,
              status: 'error',
              title: 'Error',
              description: getError(err),
            });
          })
          .finally(() => setForm(defaultForm));
      }}
      content={
        <Flex flexDirection={'column'} w={'100%'}>
          <TitleTextComponent mb={2} subTitle>
            Dados
          </TitleTextComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              type="number"
              label="Conta"
              placeholder="Digite a conta"
              value={form.account}
              error={checkFormValue(form, formSchema, 'account')}
              onChange={(input) => {
                setForm({
                  ...form,
                  account: input.target.value,
                });
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
            <InputComponent
              marginRight={8}
              label="Receita"
              placeholder="Digite a Receita"
              value={form.description}
              error={checkFormValue(form, formSchema, 'description')}
              onChange={(input) => {
                setForm({ ...form, description: input.target.value });
              }}
            />
          </FlexRegisterInputsComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="Previsão Inicial"
              placeholder="Digite a Previsão Inicial"
              value={String(form.predictedValue)}
              error={checkFormValue(form, formSchema, 'predictedValue')}
              onChange={(input) => {
                setForm({
                  ...form,
                  predictedValue: moneyMask(input.target.value, true),
                });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Previsão de Dedução"
              placeholder="Digite a Previsão de Dedução"
              value={form.predictedDeductions.toString()}
              error={checkFormValue(form, formSchema, 'predictedDeductions')}
              onChange={(input) => {
                setForm({
                  ...form,
                  predictedDeductions: moneyMask(input.target.value, true),
                });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Previsão Atualizada"
              placeholder="Digite a Previsão Atualizada"
              value={form.predictedUpdated.toString()}
              error={checkFormValue(form, formSchema, 'predictedUpdated')}
              onChange={(input) => {
                setForm({
                  ...form,
                  predictedUpdated: moneyMask(input.target.value, true),
                });
              }}
            />
          </FlexRegisterInputsComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="Arrecadação"
              placeholder="Digite a Arrecadação"
              value={form.collection.toString()}
              error={checkFormValue(form, formSchema, 'collection')}
              onChange={(input) => {
                setForm({
                  ...form,
                  collection: moneyMask(input.target.value, true),
                });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Dedução"
              placeholder="Digite a Dedução"
              value={form.deductions.toString()}
              error={checkFormValue(form, formSchema, 'deductions')}
              onChange={(input) => {
                setForm({
                  ...form,
                  deductions: moneyMask(input.target.value, true),
                });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Arrecadação Líquida"
              placeholder="Digite a Arrecadação Líquida"
              value={form.effectedValue.toString()}
              error={checkFormValue(form, formSchema, 'effectedValue')}
              onChange={(input) => {
                setForm({
                  ...form,
                  effectedValue: moneyMask(input.target.value, true),
                });
              }}
            />
          </FlexRegisterInputsComponent>
        </Flex>
      }
    />
  );
}

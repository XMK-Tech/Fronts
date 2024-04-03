import React from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import {
  checkFormValue,
  getError,
  parseDate,
} from '../../../utils/functions/utility';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import { showToast } from '../../../utils/showToast';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import { Index, saveIndex, useIndexId } from '../../../services/IndexService';
import * as yup from 'yup';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { returnCleanNumber } from '../../../utils/functions/masks';
const formSchema = yup.object().shape({
  percentage: yup.string().required('Percentual é obrigatório'),
  type: yup.string().required('Tipo é obrigatório'),
  reference: yup.string().required('Data de publicação é obrigatório'),
});
export default function IndexRegisterTemplateComponent() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const defaultForm = {
    percentage: '',
    type: 0,
    reference: '',
  };
  const [form, setForm] = React.useState<Index>({ ...defaultForm });

  const index = useIndexId(params.id || '');
  React.useEffect(() => {
    if (index.data) {
      setForm({
        id: index.data.id,
        percentage: index.data.percentage.toString(),
        reference: parseDate(index.data.reference),
        type: index.data.type,
      });
    }
  }, [index.data]);
  return (
    <RegisterStructureComponent
      title={!params.id ? 'Cadastrar Índice' : 'Editar Índice'}
      subTitle={
        !params.id
          ? 'preencha os dados para realizar o cadastro '
          : 'você pode editar as informações'
      }
      buttonTitle={!params.id ? 'Cadastrar' : 'Editar'}
      goBack="index"
      disabledButton={!formSchema.isValidSync(form)}
      onSubmit={() => {
        saveIndex({
          ...form,
          percentage: returnCleanNumber(form.percentage.toString()),
        })
          .then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: !params.id
                ? 'Índice criada com sucesso'
                : 'Índice editada com sucesso',
            });
            setForm({ ...defaultForm });
            navigate('/index');
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
              label="Percentual"
              placeholder="Digite o percentual"
              value={form.percentage.toString()}
              error={checkFormValue(form, formSchema, 'percentage')}
              onChange={(input) => {
                setForm({ ...form, percentage: input.target.value });
              }}
            />
            <InputSelectComponent
              m={'0px 24px 0px 0px'}
              label="Tipo"
              placeholder={'Selecione o tipo'}
              defaultValue={form.type.toString()}
              error={checkFormValue(form, formSchema, 'type')}
              onChange={(input) => {
                setForm({ ...form, type: Number(input.target.value) });
              }}
              options={[
                { id: '0', name: 'SELIC' },
                { id: '1', name: 'IPCA' },
              ]}
            />

            <InputComponent
              marginRight={8}
              type="date"
              label="Data de publicação"
              placeholder="Digite a Data de publicação"
              value={form.reference.toString()}
              error={checkFormValue(form, formSchema, 'reference')}
              onChange={(input) => {
                setForm({
                  ...form,
                  reference: input.target.value,
                });
              }}
            />
          </FlexRegisterInputsComponent>
        </Flex>
      }
    />
  );
}

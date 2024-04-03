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
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Rubric,
  saveRubric,
  useRubricDetails,
} from '../../../services/RubricService';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import { useStates } from '../../../services/StateServices';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';

const defaultForm = {
  name: '',
  stateId: '',
  reference: '',
  accounts: [],
};

const formSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  stateId: yup.string().required('Estado é obrigatório'),
  reference: yup.string().required('Data de Vigência é obrigatória'),
});

export default function RubricRegisterTemplateComponent() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [form, setForm] = React.useState<Rubric>({ ...defaultForm });
  const states = useStates();
  const rubric = useRubricDetails(params.id || '');
  React.useEffect(() => {
    if (rubric.data && params.id) {
      setForm({
        id: rubric.data.id,
        name: rubric.data.name,
        stateId: rubric.data.stateId,
        reference: parseDate(rubric.data.reference),
        accounts: rubric.data.accounts,
      });
    }
  }, [rubric.data, params.id]);
  return (
    <RegisterStructureComponent
      title={
        !params.id ? 'Cadastro de Rúbrica - Modelo' : 'Editar Rúbrica - Modelo'
      }
      subTitle="preencha os dados para realizar o cadastro "
      buttonTitle={!params.id ? 'Cadastrar' : 'Editar'}
      goBack="rubric"
      disabledButton={!formSchema.isValidSync(form)}
      onSubmit={() => {
        saveRubric({
          ...form,
        })
          .then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: !params.id
                ? 'Rúbrica criada com sucesso'
                : 'Rúbrica Editada com sucesso',
            });
            navigate('/rubric');
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
          <FlexRegisterInputsComponent>
            <ButtonComponent disabled onSubmit={() => {}}>
              Importar Modelo
            </ButtonComponent>
          </FlexRegisterInputsComponent>
          <TitleTextComponent mb={2} subTitle>
            Modelo
          </TitleTextComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="Nome"
              placeholder="Digite o nome"
              value={form.name}
              error={checkFormValue(form, formSchema, 'name')}
              onChange={(input) => {
                setForm({ ...form, name: input.target.value });
              }}
            />
            <InputSelectComponent
              marginRight={8}
              label="Estado"
              placeholder="Digite o Estado"
              defaultValue={form.stateId}
              options={states.data}
              error={checkFormValue(form, formSchema, 'stateId')}
              onChange={(input) => {
                setForm({ ...form, stateId: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Data de Vigência"
              placeholder="Digite a data de Vigência"
              type="date"
              value={form.reference}
              error={checkFormValue(form, formSchema, 'reference')}
              onChange={(input) => {
                setForm({ ...form, reference: input.target.value });
              }}
            />
          </FlexRegisterInputsComponent>
        </Flex>
      }
    />
  );
}

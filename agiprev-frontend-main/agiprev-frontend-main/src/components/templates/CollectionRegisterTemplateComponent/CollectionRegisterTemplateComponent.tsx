import React from 'react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import { Flex, useToast } from '@chakra-ui/react';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import * as yup from 'yup';
import {
  checkFormValue,
  getError,
  parseDate,
  parseMonth,
  useDateSelectedYear,
} from '../../../utils/functions/utility';
import saveCollection, {
  Collection,
  useCollectionId,
} from '../../../services/CollectionService';
import { showToast } from '../../../utils/showToast';
import { useNavigate, useParams } from 'react-router-dom';
import { cleanMoneyMask, moneyMask } from '../../../utils/functions/masks';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';

const formSchema = yup.object().shape({
  reference: yup.string().required('Competência é obrigatório'),
  payday: yup.string().required('Data de pagamento é obrigatório'),
  pasepValue: yup.string().required('Esse valor é obrigatório'),
  selicValue: yup.string().required('Esse valor é obrigatório'),
});

export default function CollectionRegisterTemplateComponent() {
  const toast = useToast();
  const navigate = useNavigate();
  const defaultForm = {
    reference: parseMonth(useDateSelectedYear()),
    payday: '',
    pasepValue: '',
    selicValue: '',
  };
  const [form, setForm] = React.useState<Collection>({ ...defaultForm });

  const params = useParams<{ id: string }>();
  const isEditMode = !!params.id;
  const collection = useCollectionId(params.id || '');
  React.useEffect(() => {
    if (collection.data) {
      setForm({
        id: collection.data.id,
        reference: parseMonth(collection.data.reference),
        payday: parseDate(collection.data.payday),
        pasepValue: moneyMask(String(collection.data.pasepValue)),
        selicValue: moneyMask(String(collection.data.selicValue)),
      });
    }
  }, [collection.data]);
  return (
    <>
      <RegisterStructureComponent
        title={!isEditMode ? 'Cadastro de Recolhimento' : 'Editar Recolhimento'}
        subTitle="preencha os dados para realizar o cadastro "
        buttonTitle={!isEditMode ? 'Cadastrar' : 'Editar'}
        disabledButton={!formSchema.isValidSync(form)}
        goBack="collection"
        onSubmitGoBack={() => {
          setForm({ ...defaultForm });
        }}
        onSubmit={() => {
          saveCollection({
            ...form,
            pasepValue: cleanMoneyMask(form.pasepValue.toString()),
            selicValue: cleanMoneyMask(form.selicValue.toString()),
          })
            .then((res) => {
              showToast({
                toast,
                status: 'success',
                title: 'Sucesso',
                description: !isEditMode
                  ? 'Recolhimento criado com sucesso'
                  : 'Recolhimento editado com sucesso',
              });
              navigate('/collection');
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
        centeredContent
        content={
          <Flex flexDirection={'column'} w={'100%'}>
            <FlexRegisterInputsComponent>
              <InputComponent
                marginRight={8}
                label="Competência"
                type="month"
                value={form.reference}
                error={checkFormValue(form, formSchema, 'reference')}
                onChange={(input) => {
                  setForm({ ...form, reference: input.target.value });
                }}
              />
              <InputComponent
                marginRight={8}
                type="date"
                label="Data de pagamento"
                value={form.payday}
                error={checkFormValue(form, formSchema, 'payday')}
                onChange={(input) => {
                  setForm({ ...form, payday: input.target.value });
                }}
              />
              <InputComponent
                marginRight={8}
                label="Valor Principal"
                value={form.selicValue.toString()}
                placeholder="Digite o valor principal"
                error={checkFormValue(form, formSchema, 'selicValue')}
                onChange={(input) => {
                  setForm({
                    ...form,
                    selicValue: moneyMask(input.target.value, true),
                  });
                }}
              />
            </FlexRegisterInputsComponent>
            <FlexRegisterInputsComponent>
              <InputComponent
                marginRight={8}
                w={`31.2%`}
                label="Valor total recolhido PASEP"
                placeholder="Digite o valor total recolhido PASEP"
                value={form.pasepValue.toString()}
                error={checkFormValue(form, formSchema, 'pasepValue')}
                onChange={(input) => {
                  setForm({
                    ...form,
                    pasepValue: moneyMask(input.target.value, true),
                  });
                }}
              />
            </FlexRegisterInputsComponent>
          </Flex>
        }
      />
    </>
  );
}

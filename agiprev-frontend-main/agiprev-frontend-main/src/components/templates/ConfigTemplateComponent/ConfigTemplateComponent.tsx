import React from 'react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import { Flex, useToast } from '@chakra-ui/react';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import * as yup from 'yup';
import { checkFormValue, getError } from '../../../utils/functions/utility';
import { showToast } from '../../../utils/showToast';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import {
  EntitiesApiResp,
  patchApiEntities,
  useApiEntities,
} from '../../../services/EntitiesService';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { cnpjMask } from '../../../utils/functions/masks';
import { SelectLocalizacao } from './SelectLocalizacao';

const defaultForm = {
  ipmUrl: '',
  fpmUrl: '',
  processNumber: '',
  estadoSigla: '',
  municipioNome: '',
  documents: [''],
};

const formSchema = yup.object().shape({
  ipmUrl: yup.string().required('Url IPM é obrigatório'),
  fpmUrl: yup.string().required('Url FPM é obrigatório'),
  processNumber: yup.string().required('Número do processo é obrigatório'),
  estadoSigla: yup.string().required('Selecione um estado'),
  municipioNome: yup.string().required('Selecione um município'),
});

export default function ConfigTemplateComponent() {
  const toast = useToast();
  const [form, setForm] = React.useState<EntitiesApiResp['agiprev']>({
    ...defaultForm,
  });
  const entity = useApiEntities();
  React.useEffect(() => {
    if (entity.data) {
      setForm({
        ...entity.data.agiprev,
        documents: entity.data.agiprev.documents || [''],
      });
    }
  }, [entity.data]);

  const handleEstadoChange = (estadoSigla: string) => {
    setForm((defaultForm) => ({
      ...defaultForm,
      estadoSigla: estadoSigla ?? ''
    }));
  };

  const handleMunicipioChange = (municipioNome: string) => {
    setForm((defaultForm) => ({
      ...defaultForm,
      municipioNome: municipioNome ?? ''
    }));
  };

  /* useEffect(() => {
    console.log(form.estadoSigla)
    console.log(form.municipioNome)
  }, [form]) */

  return (
    <>
      <RegisterStructureComponent
        title={'Gravar Configurações'}
        subTitle="Gravar as configurações de entidade"
        buttonTitle={'Gravar'}
        disabledButton={!formSchema.isValidSync(form)}
        onSubmitGoBack={() => {
          setForm({ ...defaultForm });
        }}
        onSubmit={() => {
          if (entity.data)
            patchApiEntities({
              ...entity.data,
              agiprev: form,
            })
              .then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Configurações salvas com sucesso',
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
        centeredContent
        content={
          <Flex flexDirection={'column'} w={'100%'}>
            <FlexRegisterInputsComponent>
              <InputComponent
                marginRight={8}
                label="Url do portal de transparência" // IPM
                placeholder="Digite a url do portal de transparência"
                value={form.ipmUrl}
                error={checkFormValue(form, formSchema, 'ipmUrl')}
                onChange={(input) => {
                  setForm({ ...form, ipmUrl: input.target.value });
                }}
              />
              <InputComponent
                marginRight={8}
                label="Url Demonstrativo-BB retenções" // FPM
                placeholder="Digite a url Demonstrativo-BB retenções"
                value={form.fpmUrl}
                error={checkFormValue(form, formSchema, 'fpmUrl')}
                onChange={(input) => {
                  setForm({ ...form, fpmUrl: input.target.value });
                }}
              />
              <InputComponent
                marginRight={8}
                label="Número do processo"
                value={form.processNumber}
                placeholder="Digite o número do processo"
                error={checkFormValue(form, formSchema, 'processNumber')}
                onChange={(input) => {
                  setForm({
                    ...form,
                    processNumber: input.target.value,
                  });
                }}
              />
            </FlexRegisterInputsComponent>

            <Flex alignItems={'row'} w={'100%'}>
              <FlexRegisterInputsComponent>
                <SelectLocalizacao
                  onEstadoChange={handleEstadoChange}
                  onMunicipioChange={handleMunicipioChange}
                  errorEstado={checkFormValue(form, formSchema, 'estadoSigla')}
                  errorMunicipio={checkFormValue(form, formSchema, 'municipioNome')}
                  selectedEstadoSigla={form.estadoSigla}
                  selectedMunicipioNome={form.municipioNome}
                />
              </FlexRegisterInputsComponent>
            </Flex>

            {form.documents.map((item, i) => (
              <FlexRegisterInputsComponent key={i}>
                <Flex alignItems={'flex-end'} w={`31.2%`}>
                  <InputComponent
                    label="CNPJ"
                    placeholder="Digite o CNPJ"
                    value={item}
                    onChange={(input) => {
                      setForm({
                        ...form,
                        documents: form.documents.map((documents, docuI) =>
                          docuI === i ? cnpjMask(input.target.value) : documents
                        ),
                      });
                    }}
                  />
                  {i === 0 ? (
                    <IconButtonComponent
                      margin={'30px 0 0 0 0'}
                      colorScheme="blue"
                      Icon={<FaPlus />}
                      arialLabel="Adicionar CNPJ"
                      onSubmit={() =>
                        setForm({
                          ...form,
                          documents: [...form.documents, ''],
                        })
                      }
                    />
                  ) : (
                    <IconButtonComponent
                      margin={'30px 0 0 0 0'}
                      Icon={<FaTrash />}
                      arialLabel="Remover CNPJ"
                      onSubmit={() =>
                        setForm({
                          ...form,
                          documents: form.documents.filter(
                            (documents, docuI) => docuI !== i
                          ),
                        })
                      }
                    />
                  )}
                </Flex>
              </FlexRegisterInputsComponent>
            ))}
          </Flex>
        }
      />
    </>
  );
}

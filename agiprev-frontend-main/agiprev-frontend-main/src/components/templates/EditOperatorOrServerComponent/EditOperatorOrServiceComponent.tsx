import { Flex, Stack } from '@chakra-ui/react';
import {
  PhysicalPerson,
  AgiPrevPersonType,
} from '../../../services/PhysicalPersonService';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import { useServerCategoriesList } from '../../../services/Server';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';

export type ProfileFormProps = {
  agiPrevPersonType: AgiPrevPersonType;
  form: PhysicalPerson;
  setForm: React.Dispatch<React.SetStateAction<PhysicalPerson | undefined>>;
};

export default function EditOperatorOrServiceComponent(
  props: ProfileFormProps
) {
  function Inputs(isServer: boolean) {
    const { data: categories } = useServerCategoriesList();
    const categoriesOptions = categories?.map((e) => ({
      id: String(e.value),
      name: e.descricao,
    }));
    return (
      <Flex>
        <Stack spacing={5} width={'90%'} marginRight={'5%'}>
          <TitleTextComponent subTitle>Informações</TitleTextComponent>
          <InputComponent
            value={props.form.serverOrOperator.name}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                serverOrOperator: {
                  ...props.form.serverOrOperator,
                  name: input.target.value,
                },
              })
            }
            label="Nome"
            placeholder="Digite o nome"
          />
          <InputComponent
            value={props.form.serverOrOperator.email}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                serverOrOperator: {
                  ...props.form.serverOrOperator,
                  email: input.target.value,
                },
              })
            }
            label="Email"
            placeholder="Digite o Email"
          />
          {isServer && (
            <>
              <InputComponent
                value={props.form.serverOrOperator.registration}
                onChange={(input) =>
                  props.setForm({
                    ...props.form,
                    serverOrOperator: {
                      ...props.form.serverOrOperator,
                      registration: input.target.value,
                    },
                  })
                }
                label="Matricula"
                placeholder="Digite a Matricula"
              />
              <InputSelectComponent
                value={String(props.form.serverOrOperator.serverCategory)}
                onChange={(input) =>
                  props.setForm({
                    ...props.form,
                    serverOrOperator: {
                      ...props.form.serverOrOperator,
                      serverCategory: Number(input.target.value),
                    },
                  })
                }
                options={categoriesOptions}
                placeholder="Categoria do servidor"
                label="Categoria do servidor"
              />
              <InputComponent
                value={props.form.serverOrOperator.pisPasepNumber}
                onChange={(input) =>
                  props.setForm({
                    ...props.form,
                    serverOrOperator: {
                      ...props.form.serverOrOperator,
                      pisPasepNumber: input.target.value,
                    },
                  })
                }
                label="Número do PIS/PASEP."
                placeholder="Digite o Número do PIS/PASEP"
              />
            </>
          )}
        </Stack>
        <Stack spacing={5} marginTop={'45px'} width={'90%'} marginRight={'5%'}>
          <InputComponent
            value={props.form.serverOrOperator.agiPrevCode}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                serverOrOperator: {
                  ...props.form.serverOrOperator,
                  agiPrevCode: input.target.value,
                },
              })
            }
            label="Código"
            placeholder="Digite o Código"
          />
          {isServer && (
            <>
              <InputComponent
                value={props.form.serverOrOperator.admissionDate}
                onChange={(input) =>
                  props.setForm({
                    ...props.form,
                    serverOrOperator: {
                      ...props.form.serverOrOperator,
                      admissionDate: input.target.value,
                    },
                  })
                }
                label="Data de admissão"
                placeholder="Digite a Data"
              />
              <InputComponent
                value={props.form.serverOrOperator.ctpsNumber}
                onChange={(input) =>
                  props.setForm({
                    ...props.form,
                    serverOrOperator: {
                      ...props.form.serverOrOperator,
                      ctpsNumber: input.target.value,
                    },
                  })
                }
                label="Número do CTPS"
                placeholder="Digite o Número do CTPS"
              />
              <InputComponent
                value={props.form.serverOrOperator.ctpsSeries}
                onChange={(input) =>
                  props.setForm({
                    ...props.form,
                    serverOrOperator: {
                      ...props.form.serverOrOperator,
                      ctpsSeries: input.target.value,
                    },
                  })
                }
                label="Série do CTPS"
                placeholder="Digite o Série do CTPS"
              />
            </>
          )}
        </Stack>
      </Flex>
    );
  }

  return Inputs(props.agiPrevPersonType === AgiPrevPersonType.Server);
}

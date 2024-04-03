import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';
import useStateList, {
  useCityList,
  useCountryList,
} from '../../../../services/StateServices';
import {
  PhysicalPerson,
  putPhysicalPerson,
} from '../../../../services/PhysicalPersonService';
import InputSelectComponent from '../../atoms/InputSelectComponent/InputSelectComponent';
import DropzoneModel from '../uploadModel/DropZoneModel';
import { showToast } from '../../../../utils/showToast';
import TabsComponent from '../../molecules/TabsComponent/TabsComponent';
import React, { useState } from 'react';
import {
  cepMask,
  cleanNumberMask,
  cpfMask,
  phoneMask,
} from '../../../../utils/functions/masks';
import ProfileTermsComponent from '../ProfileTermsComponent/ProfileTermsComponent';

export type ProfileFormProps = {
  form: PhysicalPerson;
  setForm: React.Dispatch<React.SetStateAction<PhysicalPerson | undefined>>;
};

export default function ProfileFormComponent(props: ProfileFormProps) {
  const toast = useToast();
  const [profileUrl, setProfileUrl] = useState(props.form.profilePicUrl);
  const colSpan = useBreakpointValue({ base: 12, lg: 6, xl: 3 });
  const { data: countries } = useCountryList();
  const { data: states } = useStateList(
    props.form?.addresses[0].countryId || ''
  );
  const { data: cities } = useCityList(props.form?.addresses[0].stateId || '');

  return (
    <Box backgroundColor={'white'} padding={'20px'}>
      <TabsComponent
        orientation="vertical"
        headers={[
          'Dados Pessoais',
          'Endereço',
          'Usuário',
          'Termos e Condições',
        ]}
        panels={[
          <>
            <TitleTextComponent subTitle>
              Informações pessoais
            </TitleTextComponent>
            <Grid
              templateColumns="repeat(12, 2fr)"
              marginTop={10}
              marginBottom={10}
              gap={6}
            >
              <GridItem colSpan={colSpan}>
                <InputComponent
                  margin={'0 0 10px 0'}
                  value={props.form.firstName}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      firstName: input.target.value,
                    })
                  }
                  label="Nome"
                  placeholder="Digite o nome"
                />
                <InputComponent
                  margin={'0 0 10px 0'}
                  value={props.form.lastName}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      lastName: input.target.value,
                    })
                  }
                  label="Sobrenome"
                  placeholder="Digite o sobrenome"
                />
                <InputComponent
                  value={props.form.date}
                  onChange={(input) =>
                    props.setForm({ ...props.form, date: input.target.value })
                  }
                  type="date"
                  label="Data de Nascimento"
                  placeholder="00/00/00000"
                />
              </GridItem>
              <GridItem colSpan={colSpan}>
                <InputComponent
                  margin={'0 0 10px 0'}
                  value={props.form.document}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      document: cpfMask(input.target.value),
                    })
                  }
                  label="CPF"
                  placeholder="000.000.000-00"
                />
                <InputComponent
                  value={props.form.displayName}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      displayName: input.target.value,
                    })
                  }
                  label="Apelido"
                  placeholder="Digite o nome fantasia"
                />
              </GridItem>
              <GridItem colSpan={colSpan}>
                <InputSelectComponent
                  m={'0px 0px 10px 0px'}
                  defaultValue={String(props.form.gender)}
                  options={[
                    { id: '1', name: 'Masculino' },
                    { id: '2', name: 'Feminino' },
                  ]}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      gender: Number(input.target.value),
                    })
                  }
                  label="Gênero"
                  placeholder="Selecione o seu gênero"
                />
                <InputComponent
                  value={props.form.phones[0].number}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      phones: [
                        {
                          ...props.form.phones[0],
                          number: phoneMask(input.target.value),
                        },
                      ],
                    })
                  }
                  label="Celular"
                  placeholder="(XX) 9 XXXX-XXXX"
                />
              </GridItem>
              <GridItem colSpan={colSpan}>
                <Center>
                  <DropzoneModel
                    setProfilePicUrl={setProfileUrl}
                    onUploadComplete={() => {}}
                    type="profile"
                  />
                </Center>
              </GridItem>
            </Grid>
          </>,
          <>
            <TitleTextComponent subTitle>
              Informações de endereço
            </TitleTextComponent>
            <Grid templateColumns="repeat(12, 1fr)" marginTop={10} gap={6}>
              <GridItem colSpan={colSpan}>
                <InputComponent
                  margin={'0 0 10px 0'}
                  value={props.form.addresses[0].zipcode}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      addresses: [
                        {
                          ...props.form.addresses[0],
                          zipcode: cepMask(input.target.value),
                        },
                      ],
                    })
                  }
                  label="CEP"
                  placeholder="00.000-000"
                />
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(12, 2fr)" marginBottom={20} gap={6}>
              <GridItem colSpan={colSpan}>
                <InputComponent
                  margin={'0 0 10px 0'}
                  value={props.form.addresses[0].street}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      addresses: [
                        {
                          ...props.form.addresses[0],
                          street: input.target.value,
                        },
                      ],
                    })
                  }
                  label="Rua"
                  placeholder="José Osmar Cariel"
                />
                <InputSelectComponent
                  defaultValue={props.form.addresses[0].countryId}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      addresses: [
                        {
                          ...props.form.addresses[0],
                          countryId: input.target.value,
                        },
                      ],
                    })
                  }
                  options={countries}
                  placeholder="Selecione o País"
                  label="País"
                />
              </GridItem>
              <GridItem colSpan={colSpan}>
                <InputComponent
                  value={props.form.addresses[0].complement}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      addresses: [
                        {
                          ...props.form.addresses[0],
                          complement: input.target.value,
                        },
                      ],
                    })
                  }
                  margin={'0 0 10px 0'}
                  label="Número"
                  placeholder="280"
                />
                <InputSelectComponent
                  defaultValue={props.form.addresses[0].stateId}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      addresses: [
                        {
                          ...props.form.addresses[0],
                          stateId: input.target.value,
                        },
                      ],
                    })
                  }
                  options={states}
                  placeholder="Selecione o estado"
                  label="Estado"
                />
              </GridItem>
              <GridItem colSpan={colSpan}>
                <InputComponent
                  margin={'0 0 10px 0'}
                  value={props.form.addresses[0].district}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      addresses: [
                        {
                          ...props.form.addresses[0],
                          district: input.target.value,
                        },
                      ],
                    })
                  }
                  label="Bairro"
                  placeholder="Jardim Flamboyant"
                />
                <InputSelectComponent
                  defaultValue={props.form.addresses[0].cityId}
                  options={cities}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      addresses: [
                        {
                          ...props.form.addresses[0],
                          cityId: input.target.value,
                        },
                      ],
                    })
                  }
                  label="Cidade"
                  placeholder="Selecione uma cidade"
                />
              </GridItem>
            </Grid>
          </>,
          <>
            <TitleTextComponent subTitle>
              Informações de Usuário
            </TitleTextComponent>
            <Grid templateColumns="repeat(12, 2fr)" marginTop={10} gap={6}>
              <GridItem colSpan={colSpan}>
                <InputComponent
                  margin={'0 0 10px 0'}
                  value={props.form.user.username}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      user: {
                        ...props.form.user,
                        username: input.target.value,
                      },
                    })
                  }
                  label="Nome de usuário"
                  placeholder="user123"
                />
              </GridItem>
              <GridItem colSpan={colSpan}>
                <InputComponent
                  value={props.form.user.email}
                  onChange={(input) =>
                    props.setForm({
                      ...props.form,
                      user: { ...props.form.user, email: input.target.value },
                    })
                  }
                  margin={'0 0 10px 0'}
                  label="Email"
                  placeholder="user123@mail.com"
                />
              </GridItem>
            </Grid>
          </>,
          <ProfileTermsComponent />,
        ]}
      />
      <Flex justifyContent={'end'}>
        <ButtonComponent
          margin={'0 20px 0 20px'}
          colorScheme="blue"
          variant="solid"
          onSubmit={() => {
            putPhysicalPerson({
              ...props.form,
              document: cleanNumberMask(props.form.document),
              phones: [
                {
                  ...props.form.phones[0],
                  number: cleanNumberMask(props.form.phones[0].number),
                },
              ],
              addresses: [
                {
                  ...props.form.addresses[0],
                  zipcode: cleanNumberMask(props.form.addresses[0].zipcode),
                },
              ],
              profilePicUrl: profileUrl,
            })
              .then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Salvo com sucesso',
                });
              })
              .catch((err) => {
                console.error(err);
                showToast({
                  toast,
                  status: 'error',
                  title: 'Error',
                  description: 'Ocorreu um erro desconhecido',
                });
              });
          }}
        >
          Salvar
        </ButtonComponent>
      </Flex>
    </Box>
  );
}

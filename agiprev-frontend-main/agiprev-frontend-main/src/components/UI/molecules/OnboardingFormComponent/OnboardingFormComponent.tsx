import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';
import InputComponent from '../../UI/../atoms/InputComponent/InputComponent';
import { Center, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import InputSelectComponent from '../../../UI/atoms/InputSelectComponent/InputSelectComponent';
import React from 'react';
import useStateList, {
  useCityList,
  useCountryList,
} from '../../../../services/StateServices';
import DropzoneModel from '../../organisms/uploadModel/DropZoneModel';
import RadioGroupComponent from '../../atoms/RadioGroupComponent/RadioGroupComponent';
import {
  cepMask,
  cnpjMask,
  cpfMask,
  phoneMask,
  stateRegistrationMask,
} from '../../../../utils/functions/masks';

export enum PersonType {
  physical = '1',
  juridical = '2',
}

export type FormPersonsOnboarding = {
  id?: string;
  document: string;
  name: string;
  lastName: string;
  displayName: string;
  date: string;
  profilePicUrl: string;
  stateRegistration: string;
  gender: string;
  phone: string;
};

export type FormAddressOnboarding = {
  owner: string;
  ownerId: string;
  street: string;
  district: string;
  complement: string;
  zipcode: string;
  type: number;
  cityId: string;
  stateId: string;
  countryId: string;
};

export type OnboardingFormProps = {
  type?: 'edit' | 'create';
  person: PersonType;
  setPerson: React.Dispatch<React.SetStateAction<PersonType>>;
  form: FormPersonsOnboarding;
  setForm: React.Dispatch<React.SetStateAction<FormPersonsOnboarding>>;
  address: FormAddressOnboarding;
  setAddress: React.Dispatch<React.SetStateAction<FormAddressOnboarding>>;
};

export default function OnboardingFormComponent(props: OnboardingFormProps) {
  const colSpan = useBreakpointValue({ base: 12, sm: 3 });
  const { data: countries } = useCountryList();
  const { data: states } = useStateList(props.address.countryId || '');
  const { data: cities } = useCityList(props.address.stateId || '');
  return (
    <>
      {props.type !== 'edit' && (
        <RadioGroupComponent
          onChange={(text) => props.setPerson(text as PersonType)}
          value={props.person}
          margin={'26px 0 26px 0'}
          options={[
            { id: PersonType.physical, name: 'Pessoa Física' },
            { id: PersonType.juridical, name: 'Pessoa Jurídica' },
          ]}
          direction={'row'}
        />
      )}
      <TitleTextComponent subTitle>Informações pessoais</TitleTextComponent>
      {props.person === PersonType.juridical ? (
        <Grid
          templateColumns="repeat(12, 2fr)"
          marginTop={10}
          marginBottom={10}
          gap={6}
        >
          <GridItem colSpan={colSpan}>
            <InputComponent
              margin={'0 0 10px 0'}
              value={props.form.name}
              onChange={(input) =>
                props.setForm({ ...props.form, name: input.target.value })
              }
              label="Razão social"
              placeholder="Digite a razão social"
            />
            <InputComponent
              margin={'0 0 10px 0'}
              value={props.form.date}
              onChange={(input) =>
                props.setForm({ ...props.form, date: input.target.value })
              }
              type="date"
              label="Data de fundação"
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
                  document: cnpjMask(input.target.value),
                })
              }
              label="CNPJ"
              placeholder="00.000.000/0001-00"
            />
            <InputComponent
              value={props.form.displayName}
              onChange={(input) =>
                props.setForm({
                  ...props.form,
                  displayName: input.target.value,
                })
              }
              label="Nome Fantasia"
              placeholder="Digite o nome fantasia"
            />
          </GridItem>
          <GridItem colSpan={colSpan}>
            <InputComponent
              margin={'0 0 10px 0'}
              value={props.form.stateRegistration}
              onChange={(input) =>
                props.setForm({
                  ...props.form,
                  stateRegistration: stateRegistrationMask(input.target.value),
                })
              }
              label="Inscrição Estadual"
              placeholder="000.000.000.000"
            />
            <InputComponent
              value={props.form.phone}
              onChange={(input) =>
                props.setForm({
                  ...props.form,
                  phone: phoneMask(input.target.value),
                })
              }
              label="Celular"
              placeholder="(XX) 9 XXXX-XXXX"
            />
          </GridItem>
          <GridItem colSpan={colSpan}>
            <Center>
              <DropzoneModel onUploadComplete={(input) => {}} type="profile" />
            </Center>
          </GridItem>
        </Grid>
      ) : (
        <Grid
          templateColumns="repeat(12, 2fr)"
          marginTop={10}
          marginBottom={10}
          gap={6}
        >
          <GridItem colSpan={colSpan}>
            <InputComponent
              margin={'0 0 10px 0'}
              value={props.form.name}
              onChange={(input) =>
                props.setForm({ ...props.form, name: input.target.value })
              }
              label="Nome"
              placeholder="Digite o nome"
            />
            <InputComponent
              margin={'0 0 10px 0'}
              value={props.form.lastName}
              onChange={(input) =>
                props.setForm({ ...props.form, lastName: input.target.value })
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
              placeholder="Digite o apelido"
            />
          </GridItem>
          <GridItem colSpan={colSpan}>
            <InputSelectComponent
              m={'0px 0px 10px 0px'}
              defaultValue={props.form.gender}
              options={[
                { id: '1', name: 'Masculino' },
                { id: '2', name: 'Feminino' },
              ]}
              onChange={(input) =>
                props.setForm({ ...props.form, gender: input.target.value })
              }
              label="Gênero"
              placeholder="Selecione o seu gênero"
            />
            <InputComponent
              value={props.form.phone}
              onChange={(input) =>
                props.setForm({
                  ...props.form,
                  phone: phoneMask(input.target.value),
                })
              }
              label="Celular"
              placeholder="(XX) 9 XXXX-XXXX"
            />
          </GridItem>
          <GridItem colSpan={colSpan}>
            <Center>
              <DropzoneModel onUploadComplete={() => {}} type="profile" />
            </Center>
          </GridItem>
        </Grid>
      )}
      <TitleTextComponent subTitle>Informações de endereço</TitleTextComponent>
      <Grid templateColumns="repeat(12, 1fr)" marginTop={10} gap={6}>
        <GridItem colSpan={colSpan}>
          <InputComponent
            margin={'0 0 10px 0'}
            value={props.address.zipcode}
            onChange={(input) =>
              props.setAddress({
                ...props.address,
                zipcode: cepMask(input.target.value),
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
            value={props.address.street}
            onChange={(input) =>
              props.setAddress({ ...props.address, street: input.target.value })
            }
            label="Rua"
            placeholder="José Osmar Cariel"
          />
          <InputSelectComponent
            defaultValue={props.address.countryId}
            onChange={(input) =>
              props.setAddress({
                ...props.address,
                countryId: input.target.value,
              })
            }
            options={countries}
            placeholder="Selecione o País"
            label="País"
          />
        </GridItem>
        <GridItem colSpan={colSpan}>
          <InputComponent
            margin={'0 0 10px 0'}
            value={props.address.complement}
            onChange={(input) =>
              props.setAddress({
                ...props.address,
                complement: input.target.value,
              })
            }
            label="Número"
            placeholder="280"
          />
          <InputSelectComponent
            defaultValue={props.address.stateId}
            onChange={(input) =>
              props.setAddress({
                ...props.address,
                stateId: input.target.value,
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
            value={props.address.district}
            onChange={(input) =>
              props.setAddress({
                ...props.address,
                district: input.target.value,
              })
            }
            label="Bairro"
            placeholder="Jardim Flamboyant"
          />
          <InputSelectComponent
            defaultValue={props.address.cityId}
            options={cities}
            onChange={(input) =>
              props.setAddress({ ...props.address, cityId: input.target.value })
            }
            label="Cidade"
            placeholder="Selecione uma cidade"
          />
        </GridItem>
      </Grid>
    </>
  );
}

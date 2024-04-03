import { Box, Flex, useToast } from '@chakra-ui/react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  JuridicalPersonById,
  saveJuridicalPerson,
} from '../../../services/JuridicalPersonService';
import {
  PhysicalPersonById,
  savePhysicalPerson,
  userIsValid,
} from '../../../services/PhysicalPersonService';
import {
  cepMask,
  cleanNumberMask,
  cnpjMask,
  cpfMask,
  phoneMask,
  stateRegistrationMask,
} from '../../../utils/functions/masks';
import { parseDate } from '../../../utils/functions/utility';
import { showToast } from '../../../utils/showToast';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import OnboardingFormComponent, {
  FormAddressOnboarding,
  FormPersonsOnboarding,
  PersonType,
} from '../../UI/molecules/OnboardingFormComponent/OnboardingFormComponent';

function submitPersons(
  type: string,
  form: any,
  address: FormAddressOnboarding
) {
  if (type === PersonType.physical) {
    return savePhysicalPerson({
      ...form,
      phones: [
        {
          number: cleanNumberMask(form.phone),
          type: 3,
          typeDescription: 'mobile',
        },
      ],
      document: cleanNumberMask(form.document),
      firstName: form.name,
      addresses: [{ ...address, zipcode: cleanNumberMask(address.zipcode) }],
    });
  }
  return saveJuridicalPerson({
    ...form,
    phones: [
      {
        number: cleanNumberMask(form.phone),
        type: 3,
        typeDescription: 'mobile',
      },
    ],
    document: cleanNumberMask(form.document),
    stateRegistration: cleanNumberMask(form.stateRegistration),
    establishmentFormat: '',
    addresses: [{ ...address, zipcode: cleanNumberMask(address.zipcode) }],
  });
}

export default function UsersEditTemplateComponent() {
  const navigate = useNavigate();
  const params = useParams<{ id: string; type: PersonType }>();
  const [type, setType] = React.useState<'edit' | 'create'>('create');
  const toast = useToast();
  const [person, setPerson] = React.useState<PersonType>(
    params.type || PersonType.physical
  );
  React.useEffect(() => {
    setType(params.id ? 'edit' : 'create');
  }, [params]);
  const [form, setForm] = React.useState<FormPersonsOnboarding>({
    id: '',
    document: '',
    name: '',
    lastName: '',
    displayName: '',
    date: '',
    profilePicUrl: '',
    stateRegistration: '',
    gender: '',
    phone: '',
  });
  const [address, setAddress] = React.useState<FormAddressOnboarding>({
    owner: '',
    ownerId: '',
    street: '',
    district: '',
    complement: '',
    zipcode: '',
    type: 2,
    cityId: '',
    stateId: '',
    countryId: '',
  });
  const { data: dataPhysical } = PhysicalPersonById(
    params.id || '',
    person === PersonType.physical
  );
  const { data: dataJuridical } = JuridicalPersonById(
    params.id || '',
    person === PersonType.juridical
  );
  React.useEffect(() => {
    if (dataPhysical?.id) {
      setForm({
        id: dataPhysical.id,
        document: cpfMask(dataPhysical.document),
        name: dataPhysical.firstName,
        lastName: dataPhysical.lastName,
        displayName: dataPhysical.displayName,
        date: parseDate(dataPhysical.date),
        profilePicUrl: dataPhysical.profilePicUrl,
        stateRegistration: '',
        gender: dataPhysical.gender.toString(),
        phone: phoneMask(dataPhysical.phones[0]?.number),
      });
      if (dataPhysical.addresses[0])
        setAddress({
          ...dataPhysical.addresses[0],
          countryId: dataPhysical.addresses[0].countryId || '',
          stateId: dataPhysical.addresses[0].stateId || '',
          zipcode: cepMask(dataPhysical.addresses[0].zipcode),
        });
    }
    if (dataJuridical?.id) {
      setForm({
        id: dataJuridical.id,
        document: cnpjMask(dataJuridical.document),
        name: dataJuridical.name,
        lastName: '0',
        displayName: dataJuridical.displayName,
        date: parseDate(dataJuridical.date),
        profilePicUrl: dataJuridical.profilePicUrl,
        stateRegistration: stateRegistrationMask(
          dataJuridical.stateRegistration
        ),
        gender: '',
        phone: phoneMask(dataJuridical.phones[0]?.number),
      });
      if (dataJuridical.addresses[0])
        setAddress({
          ...dataJuridical.addresses[0],
          countryId: dataJuridical.addresses[0].countryId || '',
          stateId: dataJuridical.addresses[0].stateId || '',
          zipcode: cepMask(dataJuridical.addresses[0].zipcode),
        });
    }
  }, [dataPhysical, dataJuridical]);

  return (
    <Box style={{ padding: 50 }} className="screen-container">
      <TitleTextComponent>Dados pessoais</TitleTextComponent>
      <TitleTextComponent subTitle>
        Precisamos das suas informações para fornecer um acesso completo ao
        sistema
      </TitleTextComponent>
      <OnboardingFormComponent
        type={type}
        form={form}
        setForm={setForm}
        address={address}
        setAddress={setAddress}
        person={person}
        setPerson={setPerson}
      />
      <Flex justifyContent={'end'}>
        <ButtonComponent
          margin={'0 0 0 20px'}
          colorScheme="blue"
          disabled={!userIsValid(form, address, person)}
          variant="solid"
          onSubmit={() => {
            submitPersons(person, form, address)
              .then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Salvo com sucesso',
                });
                person === PersonType.physical
                  ? navigate('/user')
                  : navigate('/juridical');
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

import OnboardingStructureComponent from '../../UI/molecules/OnboardingStructureComponent/OnboardingStructureComponent';
import { Box, useToast } from '@chakra-ui/react';
import React from 'react';
import { postOnboardingJuridicalPerson } from '../../../services/JuridicalPersonService';
import {
  postOnboardingPhysicalPerson,
  userIsValid,
} from '../../../services/PhysicalPersonService';
import OnboardingFormComponent, {
  FormAddressOnboarding,
  PersonType,
} from '../../UI/molecules/OnboardingFormComponent/OnboardingFormComponent';
import { showToast } from '../../../utils/showToast';
import { cleanNumberMask } from '../../../utils/functions/masks';
import ProfileTermsComponent from '../../UI/organisms/ProfileTermsComponent/ProfileTermsComponent';
import { getError } from '../../../utils/functions/utility';
import { useNavigate } from 'react-router-dom';

function SubmitPersons(
  type: string,
  form: any,
  address: FormAddressOnboarding
) {
  if (type === PersonType.physical) {
    return postOnboardingPhysicalPerson({
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
  return postOnboardingJuridicalPerson({
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

export default function OnboardingTemplateComponent() {
  const toast = useToast();
  const navigate = useNavigate();
  const [person, setPerson] = React.useState(PersonType.physical);
  const steps = ['Dados pessoais', 'Termos e Políticas'];
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({
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
  return (
    <OnboardingStructureComponent
      nextStepDisabled={step === 0 && !userIsValid(form, address, person)}
      onSubmit={() => {
        SubmitPersons(person, form, address)
          .then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'Salvo com sucesso',
            });
            navigate('/');
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
      step={step}
      setStep={setStep}
      titles={['Dados pessoais', 'Termos de Uso & Política de Privacidade']}
      subtitles={[
        'Precisamos das suas informações para fornecer um acesso completo ao sistema',
        'Jurídicamente precisamos que voce aceite nossos termos para o uso da plataforma',
      ]}
      steps={steps}
      currentStep={step}
    >
      <Box overflow={'auto'}>
        {step === 0 && (
          <OnboardingFormComponent
            form={form}
            setForm={setForm}
            address={address}
            setAddress={setAddress}
            person={person}
            setPerson={setPerson}
          />
        )}
        {step === 1 && <ProfileTermsComponent />}
      </Box>
    </OnboardingStructureComponent>
  );
}

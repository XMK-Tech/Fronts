import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  PhysicalPerson,
  AgiPrevPersonType,
  useMyProfile,
} from '../../../services/PhysicalPersonService';
import { cpfMask, phoneMask, cepMask } from '../../../utils/functions/masks';
import { getFirstIfAny, parseDate } from '../../../utils/functions/utility';
import LoadingComponent from '../../UI/atoms/LoadingComponent/LoadingComponent';

import ProfileFormComponent from '../../UI/organisms/ProfileFormComponent/ProfileFormComponent';
import MyRegisterFormComponent from '../MyRegisterFormComponent/MyRegisterFormComponent';
import { useServerDetails } from '../../../services/Server';
import { useOperatorDetails } from '../../../services/OperatorService';

export default function ProfileTemplateComponent() {
  const profile = useMyProfile();
  const server = useServerDetails(
    profile.data?.id ? profile.data?.id : '',
    profile.data?.agiPrevPersonType === AgiPrevPersonType.Server
  );
  const operator = useOperatorDetails(
    profile.data?.id ? profile.data?.id : '',
    profile.data?.agiPrevPersonType === AgiPrevPersonType.Operator
  );
  const serverOrOperator =
    profile.data?.agiPrevPersonType === AgiPrevPersonType.Server
      ? server
      : operator;
  const [form, setForm] = React.useState<PhysicalPerson | undefined>(undefined);
  React.useEffect(() => {
    if (profile.data) {
      setForm({
        ...profile.data,
        document: cpfMask(profile.data.document),
        date: parseDate(profile.data.date),
        phones: [
          {
            ...(getFirstIfAny(profile.data.phones) || {
              number: '',
              type: 3,
              typeDescription: 'mobile',
            }),
            number: phoneMask(getFirstIfAny(profile.data.phones)?.number),
          },
        ],
        addresses: [
          {
            ...(getFirstIfAny(profile.data.addresses) || {
              owner: 'PhysicalPerson',
              ownerId: 'owner',
              street: '',
              district: '',
              complement: '',
              zipcode: '',
              type: 2,
              cityId: '',
            }),
            zipcode: cepMask(getFirstIfAny(profile.data.addresses)?.zipcode),
          },
        ],
        serverOrOperator: serverOrOperator.data || {
          name: '',
          email: '',
          document: '',
          agiPrevCode: '',
        },
      });
    }
  }, [profile.data, serverOrOperator.data]);
  return (
    <>
      {!form ? (
        <LoadingComponent />
      ) : (
        <ProfileForm
          showRadio={
            String(profile.data?.agiPrevPersonType) === AgiPrevPersonType.Null
          }
          form={form}
          setForm={setForm}
        />
      )}
    </>
  );
}

function ProfileForm(props: {
  showRadio: boolean;
  form: PhysicalPerson;
  setForm: React.Dispatch<React.SetStateAction<PhysicalPerson | undefined>>;
}) {
  const location = useLocation();
  return location.pathname.includes('profile') ? (
    <ProfileFormComponent setForm={props.setForm} form={props.form} />
  ) : (
    <MyRegisterFormComponent
      showRadio={props.showRadio}
      setForm={props.setForm}
      form={props.form}
    />
  );
}

import {
  PersonType,
  FormPersonsOnboarding,
  FormAddressOnboarding,
} from './../components/UI/molecules/OnboardingFormComponent/OnboardingFormComponent';
import { userIsValid } from './PhysicalPersonService';

describe('Utilities', () => {
  test.each<
    [FormPersonsOnboarding, FormAddressOnboarding, PersonType, boolean]
  >([
    [
      {
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
      },
      {
        owner: '',
        ownerId: '',
        street: '',
        district: '',
        complement: '',
        zipcode: '',
        type: 0,
        cityId: '',
        stateId: '',
        countryId: '',
      },
      PersonType.physical,
      false,
    ],
    [
      {
        id: '234',
        document: '456',
        name: '4345',
        lastName: '23424',
        displayName: '234432',
        date: '2344',
        profilePicUrl: '2344',
        stateRegistration: '23434',
        gender: '234',
        phone: '2344',
      },
      {
        owner: '234',
        ownerId: '234',
        street: '234',
        district: '234',
        complement: '234',
        zipcode: '234',
        type: 2,
        cityId: '323',
        stateId: '234324',
        countryId: '234324',
      },
      PersonType.physical,
      true,
    ],
    [
      {
        id: '',
        document: '3454',
        name: '345',
        lastName: '23424',
        displayName: '234432',
        date: '2344',
        profilePicUrl: '2344',
        stateRegistration: '',
        gender: '234',
        phone: '2344',
      },
      {
        owner: '',
        ownerId: '',
        street: '234',
        district: '234',
        complement: '234',
        zipcode: '234',
        type: 2,
        cityId: '323',
        stateId: '234324',
        countryId: '234324',
      },
      PersonType.physical,
      true,
    ],
    [
      {
        id: '35345',
        document: '234234',
        name: '23424',
        lastName: '345',
        displayName: '234324',
        date: '54545',
        profilePicUrl: '234423',
        stateRegistration: '',
        gender: '3454',
        phone: '2434',
      },
      {
        owner: '',
        ownerId: '23',
        street: '345',
        district: '32443',
        complement: '53534',
        zipcode: '3434543',
        type: 1,
        cityId: '',
        stateId: '23423',
        countryId: '32424',
      },
      PersonType.juridical,
      false,
    ],
    [
      {
        id: '',
        document: '234234',
        name: '23424',
        lastName: '',
        displayName: '234324',
        date: '54545',
        profilePicUrl: '',
        stateRegistration: '345',
        gender: '',
        phone: '2434',
      },
      {
        owner: '',
        ownerId: '',
        street: '345',
        district: '32443',
        complement: '53534',
        zipcode: '3434543',
        type: 1,
        cityId: '35354',
        stateId: '23423',
        countryId: '32424',
      },
      PersonType.juridical,
      true,
    ],
  ])('getUserIsValid', (personForm, addressForm, personType, result) => {
    const validated = userIsValid(personForm, addressForm, personType);
    expect(validated).toBe(result);
  });
});

import {validations} from '../app/components/Form/FormInput'
import {
  proprietyToValueType,
  sanitizeCib,
  ValueType,
} from '../app/modules/ITR/Propriety/Registration/schema'

const apiData = {
  id: 'ee0311ca-b6bc-4f5d-9ac3-a2499f80b75c',
  createdAt: '2022-07-08T20:53:32.0760162',
  lastUpdatedAt: '0001-01-01T00:00:00',
  busyWithImprovements: '111,1',
  legalReserve: '111,1',
  permanentPreservation: '111,1',
  reforestation: '111,1',
  owners: [],
  location: {
    count: 3,
    coordenates: [
      {
        lat: -26.99,
        lng: -48.77,
      },
      {
        lat: -26.92,
        lng: -48.86,
      },
      {
        lat: -27.03,
        lng: -48.91,
      },
    ],
  },
  year: 2022,
  cibNumber: '1123',
  name: 'Teste fazenda',
  type: 0,
  linkedCib: '123',
  declaredArea: 10,
  incraCode: '1123',
  municipalRegistration: '1902390123812',
  carNumber: '123123123',
  registration: '123213123',
  hasSettlement: true,
  settlementName: '12',
  settlementType: 0,
  hasPropertyCertificate: true,
  certificateNumber: '123123123123',
  hasRegularizedLegalReserve: true,
  legalReserveArea: 120,
  hasSquattersInTheArea: false,
  occupancyPercentage: 200,
  occupancyTime: 123,
  contact: {
    email: 'rander@locomotiva.digita',
    phoneNumber: '3131313131',
    phoneType: 0,
    fax: '3131313113',
  },
  characteristics: {
    hasElectricity: true,
    hasPhone: true,
    hasInternet: true,
    hasNaturalWaterSpring: true,
    hasFishingPotential: true,
    hasPotentialForEcotourism: true,
  },
  address: {
    id: 'ca2b483a-0e80-4512-9dff-f872845a9721',
    street: 'asdasd',
    number: '123',
    district: null,
    complement: 'asdasd',
    zipcode: '33940-060',
    type: 0,
    cityId: '165943b9-dbae-4141-8712-69aa05be30cc',
    cityName: 'Belo Horizonte',
    postalCode: '33940-060',
  },
}

const valueType: ValueType = {
  busyWithImprovements: '111,1',
  legalReserve: '111,1',
  permanentPreservation: '111,1',
  reforestation: '111,1',
  identificationCIB: '1123',
  identificationimmobile: 'Teste fazenda',
  identificationArea: '10',
  identificationIncra: '1123',
  identificationMunicipalRegistration: '1902390123812',
  identificationCAR: '123123123',
  identificationRegistration: '123213123',
  adrresContactZipCode: '33940-060',
  adrresContactPubilcStreet: 'asdasd',
  adrresContactNumber: '123',
  adrresContactComplement: 'asdasd',
  adrresContactMailbox: '33940-060',
  adrresContactCounty: '165943b9-dbae-4141-8712-69aa05be30cc',
  adrresContactFax: '3131313113',
  adrresContactEmail: 'rander@locomotiva.digita',
  adrresContacttelephone: '3131313131',
  identificationRiseArea: '12',
  indentificationIncraCertified: '123123123123',
  indetificationAreaHa: '120',
  indentificationOccupancyPercentage: '200',
  indentificationOccupationTime: '123',
  identificationType: '2',
  identificationProperty: '1',
  identificationSettlement: '0',
  state: '',
  hasFishingPotential: true,
  hasRiseArea: false,
  hasEletricity: true,
  hasPhone: true,
  hasInternet: true,
  hasEcotourism: true,
  hasSource: true,
  hasPropertyCertificate: true,
  haslegalReserve: true,
  hasPosers: true,
  identificationLinkedCIB: '123',
  coordinates: [
    {
      lat: -26.99,
      lng: -48.77,
    },
    {
      lat: -26.92,
      lng: -48.86,
    },
    {
      lat: -27.03,
      lng: -48.91,
    },
  ],
  ownersDocument: [],
}

describe('Should parse values correctly', () => {
  it('should parse right values for the propriety', () => {
    const formValues = proprietyToValueType(apiData)
    expect(formValues).toStrictEqual(valueType)
  })

  it('should parse right values for the declaredArea', () => {
    expect(
      proprietyToValueType({
        ...apiData,
        declaredArea: 100,
      }).identificationArea
    ).toBe('100')
  })
  it('should parse right values for the linkedCib', () => {
    const formValues = proprietyToValueType({
      ...apiData,
      linkedCib: '123-4',
    })
    expect(formValues.identificationLinkedCIB).toBe('123-4')
  })

  it('should set defaulValue for linkedCib', () => {
    const formValues = proprietyToValueType({
      ...apiData,
      linkedCib: undefined,
    })
    expect(formValues.identificationLinkedCIB).toBe('')
  })
  it('should set defaulValue for municipal registration and CAR', () => {
    const formValues = proprietyToValueType({
      ...apiData,
      municipalRegistration: undefined,
      carNumber: undefined,
    })
    expect([
      formValues.identificationMunicipalRegistration,
      formValues.identificationCAR,
    ]).toStrictEqual(['', ''])
  })

  it('Should sanitize cib 0.0.0-1', () => {
    expect(sanitizeCib('0.0.0-1')).toBe('000-1')
  })
  it('should be valid for cib 0.894.724-4', async () => {
    const formValues = proprietyToValueType({
      ...apiData,
      cibNumber: '0.894.724-4',
    })
    expect(await validations.cib().isValid(formValues.identificationCIB)).toBe(true)
  })
})

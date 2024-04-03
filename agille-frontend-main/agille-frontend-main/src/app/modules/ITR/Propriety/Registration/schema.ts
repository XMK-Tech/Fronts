import * as Yup from 'yup'
import {validateEmail} from 'validations-br'
import {ProprietyType} from '../../../../services/ProprietyApi'
import {DrawMapPoint} from '../../../../components/DrawMap/DrawMap'
import {validations} from '../../../../components/Form/FormInput'
import {
  convertNumberToStringValue,
  convertStringValueToNumber,
} from '../../../../utils/functions/masks'

export const propertyRegistrationSchema = Yup.object().shape({
  identificationCIB: validations.cib().required('Necessário inserir CIB'),
  identificationLinkedCIB: validations.cib(),
  identificationimmobile: Yup.string(),
  identificationArea: Yup.string().required('Necessário inserir Área declarada'),
  identificationRiseArea: Yup.string().when('hasRiseArea', {
    is: true,
    then: Yup.string()
      .min(2, 'Mínimo de 2 caracteres')
      .max(50, 'Máximo de 50 caracteres')
      .required('Necessário inserir Área de assentamento'),
  }),
  identificationMunicipalRegistration: Yup.string(),

  identificationIncra: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  identificationCAR: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  identificationRegistration: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),

  indentificationIncraCertified: Yup.string().when('hasPropertyCertificate', {
    is: true,
    then: Yup.string()
      .min(3, 'Mínimo de 3 caracteres')
      .max(50, 'Máximo de 50 caracteres')
      .required('Necessário inserir número certificado do INCRA'),
  }),
  indetificationAreaHa: Yup.string().when('haslegalReserve', {
    is: true,
    then: Yup.string().max(50, 'Máximo de 50 caracteres').required('Necessário inserir área(ha)'),
  }),
  indentificationOccupancyPercentage: Yup.string().when('hasPosers', {
    is: true,
    then: Yup.string()
      .min(1, 'Mínimo de 1 caracteres')
      .max(3, 'Máximo de 3 caracteres')
      .required('Necessário inserir percentual de Ocupação'),
  }),
  indentificationOccupationTime: Yup.string().when('hasPosers', {
    is: true,
    then: Yup.string()
      .max(50, 'Máximo de 50 caracteres')
      .required('Necessário inserir tempo de ocupação (em anos)'),
  }),

  adrresContactPubilcStreet: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  adrresContactZipCode: Yup.string(),
  adrresContactNumber: Yup.string()
    .min(1, 'Mínimo de 1 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  adrresContactComplement: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  adrresContactMailbox: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  adrresContactCounty: Yup.string().required('Necessário inserir Município'),
  adrresContactFax: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  adrresContactEmail: Yup.string().test(
    'is-email',
    'Email nao é valido',
    (value) => !value || validateEmail(value || '')
  ),
  adrresContacttelephone: Yup.string().min(15, 'Mínimo de 15 caracteres'),
  identificationType: Yup.string().required('Necessário inserir Tipo de Imóvel'),
  state: Yup.string().required('Necessário inserir Estado'),
})
export const defaultInitialValues = {
  identificationCIB: '',
  identificationLinkedCIB: '',
  identificationimmobile: '',
  identificationArea: '',
  identificationIncra: '',
  identificationMunicipalRegistration: '',
  identificationCAR: '',
  identificationRegistration: '',
  adrresContactZipCode: '',
  adrresContactPubilcStreet: '',
  adrresContactNumber: '',
  adrresContactComplement: '',
  adrresContactMailbox: '',
  adrresContactCounty: '',
  adrresContactFax: '',
  adrresContactEmail: '',
  adrresContacttelephone: '',
  identificationRiseArea: '',
  indentificationIncraCertified: '',
  indetificationAreaHa: '',
  indentificationOccupancyPercentage: '',
  indentificationOccupationTime: '',
  identificationType: '',
  identificationProperty: '',
  identificationSettlement: '',
  state: '',
  hasFishingPotential: false,
  hasRiseArea: false,
  hasEletricity: false,
  hasPhone: false,
  hasInternet: false,
  hasEcotourism: false,
  hasSource: false,
  hasPropertyCertificate: false,
  haslegalReserve: false,
  hasPosers: false,
  coordinates: [] as DrawMapPoint[],
  ownersDocument: [] as {value: string; label: string}[],
  permanentPreservation: '',
  legalReserve: '',
  busyWithImprovements: '',
  reforestation: '',
}
export type ValueType = typeof defaultInitialValues

export function valueTypeToPropriety(values: ValueType): ProprietyType {
  return {
    address: values.adrresContactCounty
      ? {
          //TODO: Select city
          cityId: values.adrresContactCounty,
          complement: values.adrresContactComplement,
          //TODO: Add 'bairro'
          number: values.adrresContactNumber,
          postalCode: values.adrresContactZipCode,
          street: values.adrresContactPubilcStreet,
          type: 0,
          zipcode: values.adrresContactZipCode,
          //carNumber: '',
          //certificateNumber: 'string',
        }
      : undefined,

    linkedCib: values.identificationLinkedCIB,
    ownersDocument: values.ownersDocument.map((item) => item.value),
    carNumber: values.identificationCAR,
    certificateNumber: values.indentificationIncraCertified,
    characteristics: {
      hasElectricity: values.hasEletricity,
      hasFishingPotential: values.hasFishingPotential,
      hasInternet: values.hasInternet,
      hasNaturalWaterSpring: values.hasPosers,
      hasPhone: values.hasPhone,
      hasPotentialForEcotourism: values.hasEcotourism,
    },
    cibNumber: values.identificationCIB,
    hasPosers: values.hasPosers,
    contact: {
      email: values.adrresContactEmail,
      fax: values.adrresContactFax,
      phoneNumber: values.adrresContacttelephone,
      phoneType: 0,
    },
    //TODO: add field
    declaredArea: convertStringValueToNumber(values.identificationArea),
    hasPropertyCertificate: values.hasPropertyCertificate,
    hasRegularizedLegalReserve: values.haslegalReserve,
    //TODO: What is this?
    hasSquattersInTheArea: values?.hasRiseArea,
    incraCode: values.identificationIncra,
    //TODO: Add field
    legalReserveArea: Number(values.indetificationAreaHa),
    municipalRegistration: values.identificationMunicipalRegistration,
    name: values.identificationimmobile,
    occupancyPercentage: Number(values.indentificationOccupancyPercentage),
    occupancyTime: Number(values.indentificationOccupationTime),
    registration: values.identificationRegistration,
    settlementName: values.identificationRiseArea,
    settlementType: Number(values.identificationSettlement),
    type: Number(values.identificationType),
    coordenates: values.coordinates,
    coordinates: values.coordinates,
    permanentPreservation: convertStringValueToNumber(values.permanentPreservation),
    legalReserve: convertStringValueToNumber(values.legalReserve),
    busyWithImprovements: convertStringValueToNumber(values.busyWithImprovements),
    reforestation: convertStringValueToNumber(values.reforestation),
  }
}

export function sanitizeCib(cib: string) {
  return cib.replace(/\./g, '')
}

export function proprietyToValueType(propriety: any): ValueType {
  return {
    identificationCIB: sanitizeCib(propriety.cibNumber ?? ''),
    identificationLinkedCIB: sanitizeCib(propriety.linkedCib ?? ''),
    identificationimmobile: propriety.name ?? '',
    identificationArea: convertNumberToStringValue(propriety.declaredArea) ?? '',
    identificationIncra: propriety.incraCode ?? '',
    identificationMunicipalRegistration: propriety.municipalRegistration ?? '',
    identificationCAR: propriety.carNumber ?? '',
    identificationRegistration: propriety.registration ?? '',
    identificationRiseArea: propriety?.settlementName ?? '',
    adrresContactZipCode: propriety?.address?.zipcode ?? '',
    adrresContactPubilcStreet: propriety?.address?.street ?? '',
    adrresContactNumber: propriety?.address?.number ?? '',
    adrresContactComplement: propriety?.address?.complement ?? '',
    adrresContactMailbox: propriety?.address?.postalCode ?? '',
    adrresContactCounty: propriety?.address?.cityId ?? '',
    adrresContactFax: propriety?.contact?.fax ?? '',
    adrresContactEmail: propriety?.contact?.email ?? '',
    adrresContacttelephone: propriety?.contact?.phoneNumber ?? '',
    indentificationIncraCertified: propriety?.certificateNumber ?? '',
    indetificationAreaHa: propriety?.legalReserveArea?.toString() ?? '',
    indentificationOccupancyPercentage: propriety?.occupancyPercentage?.toString() ?? '',
    indentificationOccupationTime: propriety?.occupancyTime?.toString() ?? '',
    identificationType: '2',
    identificationProperty: '1',
    identificationSettlement: propriety?.settlementType?.toString() ?? '',
    state: propriety?.address.stateId || '',
    hasFishingPotential: propriety.characteristics?.hasFishingPotential,
    hasRiseArea: propriety?.hasSquattersInTheArea,
    hasEletricity: propriety.characteristics?.hasElectricity,
    hasPhone: propriety.characteristics?.hasPhone,
    hasInternet: propriety.characteristics?.hasInternet,
    hasEcotourism: propriety.characteristics?.hasPotentialForEcotourism,
    hasSource: propriety?.characteristics?.hasNaturalWaterSpring,
    hasPropertyCertificate: propriety?.hasPropertyCertificate,
    haslegalReserve: propriety?.hasRegularizedLegalReserve,
    hasPosers: propriety?.hasSettlement,
    coordinates: propriety?.location?.coordenates ?? [],
    ownersDocument:
      propriety?.owners?.map((item: any) => ({value: item.document, label: item.name})) ?? [],
    permanentPreservation: convertNumberToStringValue(propriety.permanentPreservation) ?? '',
    legalReserve: convertNumberToStringValue(propriety.legalReserve) ?? '',
    busyWithImprovements: convertNumberToStringValue(propriety.busyWithImprovements) ?? '',
    reforestation: convertNumberToStringValue(propriety.reforestation) ?? '',
  }
}

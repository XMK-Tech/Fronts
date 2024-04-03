import {FormikProps, useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import {validateCPF, validateCep, validateCNPJ} from 'validations-br'
import {
  RegisterFormModelColumn,
  RegisterFormModelInput,
  useCities,
  useStates,
} from '../../../components/RegisterFormModel'
import {SelectInput} from '../../../components/SelectInput'
import {RegisterFormImgColumn} from '../admin/management/Register/AdminRegisterPage'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {AttachmentDropZone} from '../../utils/components/DropZoneUp'
import {
  createJuridicalPerson,
  createPhysicalPerson,
  getPersonById,
  updateJuridicalPerson,
  updatePhysicalPerson,
} from '../../services/PersonApi'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {masks, MultipleSelectField, validations} from '../../components/Form/FormInput'
import {RegisterFormRadio, RegisterFormSwitch} from '../../../components/RegisterFormSwitch'
import {useProprietaries} from './Propriety/Registration/useProprietaries'
import {proprietyToSelect, useProprieties} from './FIscalProcedure/useProprieties'
import {intlDate, useQuery} from '../../utils/functions'
import {Stepper, validateFields} from '../../components/Stepper/Stepper'

enum PersonType {
  JURIDICAL = '1',
  PHYSICAL = '2',
}

function alternateAddressValidation(validation: Yup.StringSchema) {
  return Yup.string().when('hasAlternateAddress', {
    is: true,
    then: validation,
  })
}

function inventoryValidation(validation: Yup.StringSchema) {
  return Yup.string().when('hasInventory', {
    is: true,
    then: validation,
  })
}
function legalRepresentativeValidation(validation: Yup.StringSchema) {
  return Yup.string().when('hasLegalRepresentative', {
    is: true,
    then: validation,
  })
}

const personRegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Mínimo de 4 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Nome'),
  type: Yup.string().required('Necessário inserir Tipo'),
  gender: Yup.string().when('type', {
    is: (type: string) => type === '2',
    then: Yup.string().required('Necessário escolher Sexo'),
  }),
  displayName: Yup.string().max(50, 'Máximo de 50 caracteres'),
  socialName: Yup.string().max(50, 'Máximo de 50 caracteres'),
  numberAlternate: alternateAddressValidation(Yup.string().optional()),
  complementAlternate: alternateAddressValidation(Yup.string().optional()),
  cpf: Yup.string().when('type', {
    is: (type: string) => type === '2',
    then: Yup.string().test('is-cpf', 'CPF nao é valido', (value) => validateCPF(value || '')),
  }),
  cnpj: Yup.string().when('type', {
    is: (type: string) => type === '1',
    then: Yup.string().test('is-cnpj', 'CNPJ nao é valido', (value) => validateCNPJ(value || '')),
  }),

  cepAlternate: alternateAddressValidation(
    Yup.string().test(
      'is-cepAlternate',
      'CEP nao é valido',
      (value) => !value || validateCep(value || '')
    )
  ),

  state: Yup.string().required('Necessário inserir Estado'),
  city: Yup.string().required('Necessário inserir Cidade'),
  stateRegistration: Yup.string().when('type', {
    is: (type: string) => type === '1',
    then: Yup.string().min(12, 'Insira um documento válido'),
  }),

  hasInventory: Yup.boolean(),
  hasAlternateAddress: Yup.boolean(),
  hasLegalRepresentative: Yup.boolean(),
})

const defaultInitialValues = {
  name: '',
  type: '',
  displayName: '',
  socialName: '',
  cpf: '',
  rg: '',
  gender: '',
  birthDate: '',
  cep: '',
  street: '',
  number: '',
  district: '',
  complement: '',
  state: '',
  city: '',
  email: '',
  phone: '',
  whatsapp: '',
  file: {},
  cnpj: '',
  stateRegistration: '',
  hasInventory: false,
  hasLegalRepresentative: false,
  hasAlternateAddress: false,
  legalRepresentative: {value: '', label: ''},
  inventoryPerson: {value: '', label: ''},
  cityAlternate: '',
  stateAlternate: '',
  streetAlternate: '',
  numberAlternate: '',
  complementAlternate: '',
  districtAlternate: '',
  cepAlternate: '',
  proprieties: [] as {value: string; label: string}[],
}
type ValueType = typeof defaultInitialValues

const LastStep = (props: {editingId: string}) => (
  <div className='d-flex justify-content-center card-body pt-3 pb-15'>
    <form className='w-800px d-flex p-15 shadow rounded bg-light justify-content-center'>
      <div className='d-flex flex-column p-10 w-500px h-300px rounded bg-white justify-content-center'>
        <div className='d-flex fw-bolder text-center fs-1 mb-1 '>
          {props.editingId ? 'A sua Pessoa foi Editada com sucesso' : 'O seu Cadastro de Pessoa foi efetuado com Sucesso !'}
        </div>
        <br />

        <div className=' fw-bolder text-center fs-6 text-muted mb-1 '>
          Você pode visualizar e editar em: <br /> Gerenciamento/Consulta de Pessoas{' '}
        </div>
        <Link to='/ITR/ConsultPersons' className='p-10 d-flex flex-row justify-content-around'>
          <button type='button' className='btn btn-sm btn-primary'>
            Continuar
          </button>
        </Link>
      </div>
    </form>
  </div>
)

const Steps: React.FC<{
  selected: number
  formik: FormikProps<ValueType>
  editingId: string
  stepWasSubmited: boolean
}> = ({selected, formik, editingId, stepWasSubmited}) => {
  const states = useStates('agille')
  const cities = useCities(formik.values.state, 'agille', () => formik.setFieldValue('city', ''))
  const statesAlternate = useStates('agille')
  const citiesAlternate = useCities(formik.values.stateAlternate, 'agille', () =>
    formik.setFieldValue('cityAlternate', '')
  )
  const {proprieties} = useProprieties()
  const persons = useProprietaries()
  if (selected === 0) {
    return (
      <>
        <RegisterFormModelColumn>
          <RegisterFormModelInput
            label={formik.values.type === PersonType.JURIDICAL ? 'Razão Social' : 'Nome'}
            placeholder={
              formik.values.type === PersonType.JURIDICAL ? 'Ex: Empresa ltda' : 'Ex: João'
            }
            fieldProps={formik.getFieldProps('name')}
            touched={formik.touched.name || stepWasSubmited}
            errors={formik.errors.name}
            type='text'
          />
          <RegisterFormModelInput
            label='Nome Social'
            placeholder='Leticia'
            fieldProps={formik.getFieldProps('socialName')}
            touched={formik.touched.socialName || stepWasSubmited}
            errors={formik.errors.socialName}
            type='text'
          />
          {formik.values.type === PersonType.PHYSICAL && (
            <RegisterFormModelInput
              label='CPF'
              placeholder='Ex: 829.647.430-10'
              fieldProps={formik.getFieldProps('cpf')}
              touched={formik.touched.cpf || stepWasSubmited}
              errors={formik.errors.cpf}
              mask={masks.cpf}
              type='text'
            />
          )}
          {formik.values.type === PersonType.JURIDICAL && (
            <RegisterFormModelInput
              label='CNPJ'
              placeholder='Ex: 14.409.471/0001-62'
              fieldProps={formik.getFieldProps('cnpj')}
              touched={formik.touched.cnpj || stepWasSubmited}
              errors={formik.errors.cnpj}
              type='text'
              mask={masks.cnpj}
            />
          )}
          <RegisterFormModelInput
            label={
              formik.values.type === PersonType.JURIDICAL
                ? 'Data de fundação'
                : 'Data de nascimento'
            }
            placeholder='Ex.: 30672-772'
            fieldProps={formik.getFieldProps('birthDate')}
            touched={formik.touched.birthDate || stepWasSubmited}
            errors={formik.errors.birthDate}
            type='date'
          />
          <RegisterFormRadio
            fieldProps={formik.getFieldProps('hasInventory')}
            errors={formik.errors.hasInventory}
            touched={formik.touched.hasInventory || stepWasSubmited}
            label='Possui Inventariante ?'
            formik={formik}
          />

          {formik.values.hasInventory && (
            <>
              <MultipleSelectField
                //disabled={!!editingId}
                isMulti={false}
                label='Inventariante'
                formik={formik}
                field={formik.getFieldProps('inventoryPerson')}
                dataSelectMultiple={persons.map((e) => ({value: e.id, label: e.name}))}
              />

              <Link
                className='mw-300px mb-8'
                to={'/ITR/RegisterPersons?type=Inventariante'}
                target='_blank'
                rel='noopener noreferrer'
              >
                Caso não tenha encontrado o Invetariante Você pode cadastrá-lo clicando aqui
              </Link>

              <RegisterFormModelInput
                label='Observações'
                placeholder='Digite sua observação'
                fieldProps={formik.getFieldProps('inventoryObs')}
                touched={formik.touched.socialName || stepWasSubmited}
                errors={formik.errors.socialName}
                type='text'
                mask={masks.textArea}
              />
            </>
          )}
        </RegisterFormModelColumn>
        <RegisterFormModelColumn>
          <SelectInput
            disabled={!!editingId}
            label='Tipo da pessoa'
            fieldProps={formik.getFieldProps('type')}
            touched={formik.touched.type || stepWasSubmited}
            errors={formik.errors.type}
            data={[
              {id: PersonType.PHYSICAL, name: 'Pessoa Física'},
              {id: PersonType.JURIDICAL, name: 'Pessoa Jurídica'},
            ]}
          />
          <MultipleSelectField
            label='Imóveis'
            field={formik.getFieldProps('proprieties')}
            dataSelectMultiple={proprieties}
            formik={formik}
          />

          <RegisterFormModelInput
            label={formik.values.type === PersonType.JURIDICAL ? 'Nome Fantasia' : 'Apelido'}
            placeholder={
              formik.values.type === PersonType.JURIDICAL ? 'Ex: Mc Donalds' : 'Ex: Janio'
            }
            fieldProps={formik.getFieldProps('displayName')}
            touched={formik.touched.displayName || stepWasSubmited}
            errors={formik.errors.displayName}
            type='text'
          />

          {formik.values.type === PersonType.PHYSICAL && (
            <RegisterFormModelInput
              label='RG'
              placeholder='Ex: 353394099'
              fieldProps={formik.getFieldProps('rg')}
              touched={formik.touched.rg || stepWasSubmited}
              errors={formik.errors.rg}
              type='text'
            />
          )}
          {formik.values.type === PersonType.JURIDICAL && (
            <RegisterFormModelInput
              label='Inscrição estadual'
              placeholder='Ex: 133.208.580.676'
              fieldProps={formik.getFieldProps('stateRegistration')}
              touched={formik.touched.stateRegistration || stepWasSubmited}
              errors={formik.errors.stateRegistration}
              type='text'
              mask={masks.stateRegistration}
            />
          )}
          {formik.values.type === PersonType.PHYSICAL && (
            <SelectInput
              label='Sexo'
              fieldProps={formik.getFieldProps('gender')}
              touched={formik.touched.gender || stepWasSubmited}
              errors={formik.errors.gender}
              data={[
                {id: '0', name: 'Masculino'},
                {id: '1', name: 'Feminino'},
                {id: '2', name: 'Outros'},
              ]}
            />
          )}
          <RegisterFormRadio
            fieldProps={formik.getFieldProps('hasLegalRepresentative')}
            errors={formik.errors.hasLegalRepresentative}
            touched={formik.touched.hasLegalRepresentative || stepWasSubmited}
            label='Possui Representante Legal?'
            formik={formik}
          />

          {formik.values.hasLegalRepresentative && (
            <>
              <MultipleSelectField
                //disabled={!!editingId}
                isMulti={false}
                label='Representante Legal'
                formik={formik}
                field={formik.getFieldProps('legalRepresentative')}
                dataSelectMultiple={persons.map((e) => ({value: e.id, label: e.name}))}
              />
              <Link
                className='mw-300px mb-8'
                to={'/ITR/RegisterPersons?type=Representante Legal'}
                target='_blank'
                rel='noopener noreferrer'
              >
                Caso não tenha encontrado o Representante Legal Você pode cadastrá-lo clicando aqui
              </Link>
              <RegisterFormModelInput
                label='Observações'
                placeholder='Digite sua observação'
                fieldProps={formik.getFieldProps('legalRepresentativeObs')}
                touched={formik.touched.socialName || stepWasSubmited}
                errors={formik.errors.socialName}
                type='text'
                mask={masks.textArea}
              />
            </>
          )}
        </RegisterFormModelColumn>
        <RegisterFormModelColumn container='center'>
          <AttachmentDropZone
            acceptArchive={''}
            title='Upload de imagem'
            onSubmit={(_fileWithMeta, attachmentId) => {
              formik.values.file = _fileWithMeta
            }}
          />
        </RegisterFormModelColumn>
      </>
    )
  }
  if (selected === 1) {
    return (
      <>
        <RegisterFormModelColumn>
          <RegisterFormModelInput
            label='Cep'
            placeholder='Ex: 69935-970'
            fieldProps={formik.getFieldProps('cep')}
            touched={formik.touched.cep || stepWasSubmited}
            errors={formik.errors.cep}
            type='text'
            mask={masks.cep}
          />
          <RegisterFormModelInput
            label='Número'
            placeholder='Ex: 123'
            fieldProps={formik.getFieldProps('number')}
            touched={formik.touched.number || stepWasSubmited}
            errors={formik.errors.number}
            type='text'
          />
          <SelectInput
            label='Estado'
            fieldProps={formik.getFieldProps('state')}
            touched={formik.touched.state || stepWasSubmited}
            errors={formik.errors.state}
            data={states}
          />
          <RegisterFormModelInput
            label='Complemento'
            placeholder='Ex:'
            fieldProps={formik.getFieldProps('complement')}
            touched={formik.touched.complement || stepWasSubmited}
            errors={formik.errors.complement}
            type='text'
          />
          <RegisterFormModelInput
            label='Whatsapp'
            placeholder='Ex: (11) 98867-2352'
            fieldProps={formik.getFieldProps('whatsapp')}
            touched={formik.touched.whatsapp || stepWasSubmited}
            errors={formik.errors.whatsapp}
            type='text'
            mask={masks.phone}
          />
        </RegisterFormModelColumn>

        <RegisterFormModelColumn>
          <RegisterFormModelInput
            label='Logradouro'
            placeholder='Ex: Rua madureira'
            fieldProps={formik.getFieldProps('street')}
            touched={formik.touched.street || stepWasSubmited}
            errors={formik.errors.street}
            type='text'
          />
          <RegisterFormModelInput
            label='Bairro'
            placeholder='Ex: Vila maca'
            fieldProps={formik.getFieldProps('district')}
            touched={formik.touched.district || stepWasSubmited}
            errors={formik.errors.district}
            type='text'
          />
          <SelectInput
            label='Cidade'
            fieldProps={formik.getFieldProps('city')}
            touched={formik.touched.city || stepWasSubmited}
            errors={formik.errors.city}
            data={cities}
          />
          <RegisterFormModelInput
            label='Email'
            placeholder='Ex: teste@gmail.com'
            fieldProps={formik.getFieldProps('email')}
            touched={formik.touched.email || stepWasSubmited}
            errors={formik.errors.email}
            type='text'
          />
          <RegisterFormModelInput
            label='Telefone'
            placeholder='Ex: (11) 98867-2352'
            fieldProps={formik.getFieldProps('phone')}
            touched={formik.touched.phone || stepWasSubmited}
            errors={formik.errors.phone}
            type='text'
            mask={masks.phone}
          />
        </RegisterFormModelColumn>
        <RegisterFormImgColumn>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/worldMap.svg')}
            className='img-fluid'
          />
        </RegisterFormImgColumn>
      </>
    )
  }
  if (selected === 2) {
    return (
      <>
        <RegisterFormModelColumn>
          <div className='py-3'>
            <RegisterFormSwitch
              fieldProps={formik.getFieldProps('hasAlternateAddress')}
              errors={formik.errors.hasAlternateAddress}
              touched={formik.touched.hasAlternateAddress || stepWasSubmited}
              label='Possui Endereço Alternativo?'
            />
          </div>
          {formik.values.hasAlternateAddress && (
            <div className='d-flex'>
              <RegisterFormModelColumn>
                <RegisterFormModelInput
                  label='Logradouro '
                  placeholder='Ex: Casa'
                  fieldProps={formik.getFieldProps('streetAlternate')}
                  touched={formik.touched.streetAlternate || stepWasSubmited}
                  errors={formik.errors.streetAlternate}
                  type='text'
                />
                <RegisterFormModelInput
                  label='Número'
                  placeholder='Ex: 15'
                  fieldProps={formik.getFieldProps('numberAlternate')}
                  touched={formik.touched.numberAlternate || stepWasSubmited}
                  errors={formik.errors.numberAlternate}
                  type='text'
                  mask={masks.number}
                />
                <RegisterFormModelInput
                  label='Complemento '
                  placeholder='Ex: Mercearia'
                  fieldProps={formik.getFieldProps('complementAlternate')}
                  touched={formik.touched.complementAlternate || stepWasSubmited}
                  errors={formik.errors.complementAlternate}
                  type='text'
                />
                <RegisterFormModelInput
                  label='Cep'
                  placeholder='Ex: 69935-970'
                  fieldProps={formik.getFieldProps('cepAlternate')}
                  touched={formik.touched.cepAlternate || stepWasSubmited}
                  errors={formik.errors.cepAlternate}
                  type='text'
                  mask={masks.cep}
                />
              </RegisterFormModelColumn>
              <RegisterFormModelColumn>
                <SelectInput
                  label='Estado'
                  fieldProps={formik.getFieldProps('stateAlternate')}
                  touched={formik.touched.stateAlternate || stepWasSubmited}
                  errors={formik.errors.stateAlternate}
                  data={statesAlternate}
                />
                <SelectInput
                  label='Cidade'
                  fieldProps={formik.getFieldProps('cityAlternate')}
                  touched={formik.touched.cityAlternate || stepWasSubmited}
                  errors={formik.errors.cityAlternate}
                  data={citiesAlternate}
                />
                <RegisterFormModelInput
                  label='Bairro'
                  placeholder='Ex: Nova Granada'
                  fieldProps={formik.getFieldProps('districtAlternate')}
                  touched={formik.touched.districtAlternate || stepWasSubmited}
                  errors={formik.errors.districtAlternate}
                  type='text'
                />
              </RegisterFormModelColumn>
              <RegisterFormImgColumn>
                <img
                  alt='Logo'
                  src={toAbsoluteUrl('/media/illustrations/custom/worldMap.svg')}
                  className='img-fluid'
                />
              </RegisterFormImgColumn>
            </div>
          )}
        </RegisterFormModelColumn>
      </>
    )
  }
  return <LastStep editingId={editingId} />
}

function dataToValues(data: any): ValueType {
  return {
    name: data.name ?? '',
    type: data.personType.toString() ?? '',
    displayName: data.displayName ?? '',
    socialName: data.socialName ?? '',
    cpf: data.document ?? '',
    rg: data.generalRecord ?? '',
    gender: data.gender ?? '',
    birthDate: intlDate(data.date) ?? '',
    cep: data.addresses[0]?.zipcode ?? '',
    street: data.addresses[0]?.street ?? '',
    number: data.addresses[0]?.number ?? '',
    district: data.addresses[0]?.district ?? '',
    complement: data.addresses[0]?.complement ?? '',
    state: data.addresses[0]?.stateId ?? '',
    city: data.addresses[0]?.cityId ?? '',
    email: data.emails[0] ?? '',
    phone: data.phones[0]?.number ?? '',
    whatsapp: data.phones[1]?.number ?? '',
    file: data.profilePicUrl ?? '',
    cnpj: data.document ?? '',
    stateRegistration: data.municipalRegistration ?? '',
    hasInventory: data.hasInventoryPerson ?? false,
    hasLegalRepresentative: data.hasLegalRepresentative ?? false,
    hasAlternateAddress: data.addresses.length > 1 ?? false,
    cityAlternate: data.addresses[1]?.cityId ?? '',
    stateAlternate: data.addresses[1]?.stateId ?? '',
    streetAlternate: data.addresses[1]?.street ?? '',
    numberAlternate: data.addresses[1]?.number ?? '',
    complementAlternate: data.addresses[1]?.complement ?? '',
    cepAlternate: data.addresses[1]?.zipcode ?? '',
    districtAlternate: data.addresses[1]?.district ?? '',
    legalRepresentative: data.legalRepresentative ?? '',
    inventoryPerson: data.inventoryPerson ?? '',
    proprieties: data.proprieties?.map(proprietyToSelect) ?? [],
  }
}

const PersonRegisterForm: React.FC<{}> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState(defaultInitialValues)
  const {id} = useParams<{id: string}>()
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false)
  const [editingId, setEditingId] = useState('')
  const [isFinished, setIsFinished] = useState<boolean>(false)

  useEffect(() => {
    if (id) {
      setIsLoadingList(true)
      getPersonById(id)
        .then(({data: data}) => {
          setEditingId(data.juridicalOrPhysicalPersonId)
          setInitialValues(dataToValues(data))
        })
        .finally(() => setIsLoadingList(false))
    }
  }, [id])
  const query = useQuery()
  const typeText = query.get('type') ?? 'Contribuinte'
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: personRegisterSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: async (values, {setStatus}) => {
      try {
        setIsLoading(true)
        await saveProprietary()
        setIsFinished(true)
      } catch (err: any) {
        setStatus({
          message: err,
        })
      } finally {
        setIsLoading(false)
      }
      async function saveProprietary() {
        if (!editingId) {
          if (values.type === PersonType.JURIDICAL) {
            return await createJuridical(values)
          } else {
            return await createPhysical(values)
          }
        } else {
          if (values.type === PersonType.JURIDICAL) {
            return await updateJuridical(editingId, values)
          } else {
            return await updatePhysical(editingId, values)
          }
        }
      }
    },
  })
  return (
    <>
      <div className={`card`}>
        {isLoadingList ? (
          <IsLoadingList />
        ) : (
          <>
            <div className='d-flex flex-row'>
              <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bolder fs-3 mb-1'>
                    {id ? 'Editar' : 'Cadastro de'} {typeText}
                  </span>
                </h3>
              </div>
            </div>
            <Stepper
              error={formik.status}
              renderStep={(step, stepWasSubmited) => {
                return (
                  <Steps
                    stepWasSubmited={stepWasSubmited}
                    editingId={editingId}
                    selected={step}
                    formik={formik}
                  />
                )
              }}
              canGoToNextStep={(step) => {
                console.error(formik.errors)
                if (step === 0) {
                  return !validateFields(formik, [
                    'name',
                    'type',
                    'socialName',
                    'proprieties',
                    'birthDate',
                    'displayName',
                    'hasInventory',
                    'hasLegalRepresentative',
                    'inventoryPerson',
                    'legalRepresentative',
                    'cpf',
                    'rg',
                    'gender',
                    'cnpj',
                    'stateRegistration',
                    'displayName',
                  ])
                }
                if (step === 1) {
                  return !validateFields(formik, [
                    'cep',
                    'street',
                    'number',
                    'district',
                    'state',
                    'city',
                    'complement',
                    'email',
                    'whatsapp',
                    'phone',
                  ])
                }
                if (step === 2) {
                  return !validateFields(formik, [
                    'cepAlternate',
                    'streetAlternate',
                    'numberAlternate',
                    'districtAlternate',
                    'stateAlternate',
                    'cityAlternate',
                    'complementAlternate',
                  ])
                }
                return true
              }}
              isLoading={isLoading}
              onSubmit={formik.handleSubmit}
              showLastStep={isFinished}
              steps={['Informações', 'Endereço e Contato', 'Endereço Alternativo', 'Concluído']}
            />
          </>
        )}
      </div>
    </>
  )
}

async function updatePhysical(editingId: string, values: ValueType) {
  await updatePhysicalPerson(editingId, valueTypeToPhysicalPerson(values))
}

async function updateJuridical(id: string, values: ValueType) {
  return await updateJuridicalPerson(id, valueTypeToJuridicalPerson(values))
}

async function createPhysical(values: ValueType) {
  return await createPhysicalPerson(valueTypeToPhysicalPerson(values))
}

function valueTypeToPhysicalPerson(values: ValueType) {
  return {
    name: values.name,
    document: values.cpf,
    displayName: values.displayName,
    generalRecord: values.rg,
    hasInventoryPerson: values.hasInventory,
    hasLegalRepresentative: values.hasLegalRepresentative,
    addresses: getAddresses(values),
    date: values.birthDate || '0001-01-01',
    emails: [values.email],
    municipalRegistration: values.stateRegistration,
    phones: getPhones(values),
    hasAlternateAddress: values.hasAlternateAddress,
    cityAlternate: values.cityAlternate,
    stateAlternate: values.stateAlternate,
    streetAlternate: values.streetAlternate,
    numberAlternate: values.numberAlternate,
    complementAlternate: values.complementAlternate,
    cepAlternate: values.cepAlternate,
    districtAlternate: values.districtAlternate,
    legalRepresentative: values.legalRepresentative.value ?? '',
    inventoryPerson: values.inventoryPerson?.value ?? '',
    proprieties: values.proprieties.map((p) => p.value),
    socialName: values.socialName,
  }
}

function valueTypeToJuridicalPerson(values: ValueType) {
  return {
    name: values.name,
    document: values.cnpj,
    displayName: values.displayName,
    addresses: getAddresses(values),
    date: values.birthDate || '0001-01-01',
    emails: [values.email],
    municipalRegistration: values.stateRegistration,
    phones: getPhones(values),
    hasAlternateAddress: values.hasAlternateAddress,
    cityAlternate: values.cityAlternate,
    stateAlternate: values.stateAlternate,
    streetAlternate: values.streetAlternate,
    numberAlternate: values.numberAlternate,
    complementAlternate: values.complementAlternate,
    cepAlternate: values.cepAlternate,
    districtAlternate: values.districtAlternate,
    proprieties: values.proprieties.map((p) => p.value),
    socialName: values.socialName,
  }
}

function getPhones(values: ValueType) {
  return [
    {number: values.whatsapp, typeDescription: 'Whatsapp'},
    {number: values.phone, typeDescription: 'Telefone'},
  ]
}

function getAddresses(values: ValueType) {
  return [
    {
      complement: values.complement,
      district: values.district,
      number: values.number,
      street: values.street,
      cityId: values.city,
      zipcode: values.cep,
      type: 1,
    },
    ...(values.hasAlternateAddress && values.cityAlternate
      ? [
          {
            complement: values.complementAlternate,
            district: values.districtAlternate,
            number: values.numberAlternate,
            street: values.streetAlternate,
            zipcode: values.cepAlternate,
            cityId: values.cityAlternate,
            function: 2,
            type: 1,
          },
        ]
      : []),
  ]
}

async function createJuridical(values: ValueType) {
  return await createJuridicalPerson(valueTypeToJuridicalPerson(values))
}

function PersonRegister() {
  return <PersonRegisterForm />
}

export default PersonRegister

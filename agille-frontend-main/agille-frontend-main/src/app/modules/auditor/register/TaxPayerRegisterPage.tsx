import {useFormik} from 'formik'
import {FormikProps} from 'formik/dist/types'
import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {
  createJuridicalPerson,
  getJuridicalPerson,
  updateJuridicalPerson,
} from '../../../services/JuridicalPersonApi'
import Form from '../../../components/Form/Form'
import {getApiServiceType} from '../../../services/PersonApi'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {
  RegisterFormModel,
  RegisterFormModelColumn,
  RegisterFormModelInput,
  useCities,
  useStates,
} from '../../../../components/RegisterFormModel'
import {SelectInput} from '../../../../components/SelectInput'
import {masks, MultipleSelectField} from '../../../components/Form/FormInput'
import {RegisterFormRadio} from '../../../../components/RegisterFormSwitch'
import {FormError} from '../../../../components/FormError'
import {flatArray, useQuery} from '../../../utils/functions'


const userRegisterSchema = Yup.object().shape({
  name: Yup.string().required('Necessário inserir Nome'),
  document: Yup.string().required('Necessário inserir CNPJ'),
  street: Yup.string().required('Necessário inserir Endereço'),
  state: Yup.string().required('Necessário escolher UF'),
  number: Yup.string().required('Necessário inserir Número'),
  neighborhood: Yup.string().required('Necessário inserir Bairro'),
  city: Yup.string().required('Necessário escolher Município'),
  enrollment: Yup.string().required('Necessário inserir Inscrição Municipal'),
  zipcode: Yup.string().required('Necessário inserir CEP'),
})

const defaultInitialValues = {
  name: '',
  document: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  zipcode: '',
  enrollment: '',
  isCardOperator: false,
  serviceTypes: [] as {value: string; label: string}[],
}

type ValueType = typeof defaultInitialValues

type ServiceDescription = {
  id: string
  issRate: number
  issAnnualValue: number
  description: string
  code: string
}

type ServicesTypeList = {
  id: string
  name: string
  descriptions: ServiceDescription[]
}[]

const UserTable: React.FC<{}> = () => {
  const [initialValues, setInitialValues] = React.useState(defaultInitialValues)
  const [isCardOperator, setIsCardOperator] = useState(false)
  const history = useHistory()
  const {id} = useParams<{id: string}>()
  const [isLoading, setIsLoading] = useState(false)
  const query = useQuery()

  useEffect(() => {
    const doc = query.get('doc')
    if (doc) {
      setInitialValues({
        ...initialValues,
        document: doc,
      })
    }
  }, [query])
  useEffect(() => {
    if (id) {
      getJuridicalPerson(id).then(({data}) => {
        const user = data as any
        const address = user.addresses?.[0] ?? {}
        setInitialValues({
          name: user.name ?? '',
          document: user.document ?? '',
          street: address.street ?? '',
          number: address.number ?? '',
          neighborhood: address.district ?? '',
          city: address.cityId ?? '',
          state: address.stateId ?? '',
          zipcode: address.zipcode ?? '',
          enrollment: user.municipalRegistration ?? '',
          isCardOperator: user.isCardOperator ?? false,
          serviceTypes: flatArray(
            user.serviceTypes?.map((serviceType: any) =>
              serviceType.descriptions.map((type: any) => ({
                value: type.id,
                label: type.code + ' - ' + type.description,
              }))
            ) ?? []
          ),
        })
      })
    }
  }, [id])

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userRegisterSchema,
    enableReinitialize: true,
    onSubmit: async (values, {setStatus}) => {
      setIsLoading(true)
      try {
        const selectedTypes = values.serviceTypes.map((type: any) => type.value)
        if (id) {
          await updateJuridicalPerson(id, {
            document: values.document,
            municipalRegistration: values.enrollment,
            name: values.name,
            serviceTypesDescriptionIds: selectedTypes,
            isCardOperator: values.isCardOperator,
            addresses: [
              {
                street: values.street,
                number: values.number,
                zipcode: values.zipcode,
                district: values.neighborhood,
                county: values.city,
                cityId: values.city,
                type: 1,
              },
            ],
          })
        } else {
          await createJuridicalPerson({
            document: values.document,
            municipalRegistration: values.enrollment,
            name: values.name,
            serviceTypesDescriptionIds: selectedTypes,
            isCardOperator: values.isCardOperator,
            addresses: [
              {
                street: values.street,
                number: values.number,
                zipcode: values.zipcode,
                district: values.neighborhood,
                county: values.city,
                cityId: values.city,
                type: 1,
              },
            ],
          })
        }
        values.isCardOperator
          ? history.push('/auditor/cadastros/consulta-operadoras')
          : history.push('/auditor/cadastros/consulta-contribuintes')
      } catch (err) {
        setStatus({message: err})
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <FormBody
      formik={formik}
      isLoading={isLoading}
      isCardOperator={isCardOperator}
      setIsCardOperator={setIsCardOperator}
    />
  )
}

function FormBody({
  formik,
  isLoading,
}: {
  formik: FormikProps<ValueType>
  isCardOperator: boolean
  isLoading: boolean
  setIsCardOperator: (param: boolean) => void
}) {
  const {id} = useParams<{id: string}>()
  const [servicesTypeList, setServicesTypeList] = useState<ServicesTypeList | null>(null)

  const servicesType = async () => {
    await getApiServiceType().then((res) => {
      setServicesTypeList(res.data)
    })
  }
  useEffect(() => {
    servicesType()
  }, [])

  const options = servicesTypeList?.reduce((prev, curr) => {
    return [...prev, ...curr.descriptions]
  }, [] as ServiceDescription[])
  const states = useStates('agille')
  const cities = useCities(formik.values.state, 'agille', () => {
    formik.setFieldValue('city', '')
  })
  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>
              {id ? 'Editar Contribuinte' : 'Cadastro de Contribuinte'}
            </span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <RegisterFormModel onSubmit={formik.handleSubmit}>
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Nome'
                placeholder='Insira o nome'
                fieldProps={formik.getFieldProps('name')}
                touched={formik.touched.name}
                errors={formik.errors.name}
                type='text'
              />
              <RegisterFormModelInput
                label='Rua'
                placeholder='Insira a rua'
                fieldProps={formik.getFieldProps('street')}
                touched={formik.touched.street}
                errors={formik.errors.street}
                type='text'
              />
              <RegisterFormModelInput
                label='Bairro'
                placeholder='insira o bairro'
                fieldProps={formik.getFieldProps('neighborhood')}
                touched={formik.touched.neighborhood}
                errors={formik.errors.neighborhood}
                type='text'
              />

              <SelectInput
                label='Estado'
                fieldProps={formik.getFieldProps('state')}
                touched={formik.touched.state}
                errors={formik.errors.state}
                data={states}
              />
              <SelectInput
                label='Município'
                id='inputMunicipio'
                fieldProps={formik.getFieldProps('city')}
                touched={formik.touched.city}
                errors={formik.errors.city}
                data={cities}
              />

              <RegisterFormRadio
                fieldProps={formik.getFieldProps('isCardOperator')}
                errors={undefined}
                touched={undefined}
                label='O contribuinte é uma operadora de cartão?'
                formik={formik}
              />
            </RegisterFormModelColumn>
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Inscrição Municipal'
                placeholder='insira a inscrição municipal'
                fieldProps={formik.getFieldProps('enrollment')}
                touched={formik.touched.enrollment}
                errors={formik.errors.enrollment}
                mask={masks.municipalRegistration}
                type='text'
              />
              <RegisterFormModelInput
                label='CNPJ'
                placeholder='Insira o CNPJ'
                fieldProps={formik.getFieldProps('document')}
                touched={formik.touched.document}
                errors={formik.errors.document}
                type='text'
                mask={masks.cnpj}
              />
              <RegisterFormModelInput
                label='Número'
                placeholder='Insira o número'
                fieldProps={formik.getFieldProps('number')}
                touched={formik.touched.number}
                errors={formik.errors.number}
                mask={masks.number}
                type='text'
              />

              <RegisterFormModelInput
                label='CEP'
                placeholder='Insira o CEP'
                fieldProps={formik.getFieldProps('zipcode')}
                touched={formik.touched.zipcode}
                errors={formik.errors.zipcode}
                mask={masks.cep}
                type='text'
              />
              <MultipleSelectField
                label='Tipos de serviço'
                field={formik.getFieldProps('serviceTypes')}
                dataSelectMultiple={
                  options?.map((e) => ({
                    value: e.id,
                    label: `${e.code} - ${e.description}`,
                  })) || []
                }
                formik={formik}
              />
            </RegisterFormModelColumn>
            <RegisterFormModelColumn container='center'>
              <div className='mw-300px'>
                <img
                  alt='Logo'
                  src={toAbsoluteUrl(
                    '/media/illustrations/custom/contribuintesRegisterIllustration.svg'
                  )}
                  className='img-fluid'
                />
              </div>
            </RegisterFormModelColumn>
          </RegisterFormModel>
        </div>
        <div className='card-footer'>
          <div className='p-5 d-flex flex-row justify-content-around'>
            <CustomButton
              label={id ? 'Editar' : 'Cadastrar'}
              isLoading={isLoading}
              disabled={isLoading}
              onSubmit={formik.handleSubmit}
            />
          </div>
          <FormError status={formik.status} />
        </div>
      </div>
    </>
  )
}

export default function TaxPayerRegisterPage() {
  return <UserTable></UserTable>
}

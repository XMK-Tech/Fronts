import {useFormik} from 'formik'
import {FormikProps} from 'formik/dist/types'
import React, {useEffect, useState} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import {useHistory, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import {RootState} from '../../../setup'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {createAuditorUser, getUser, updateAuditorUser} from '../../services/UsersApi'
import {RegisterFormImgColumn} from '../admin/management/Register/AdminRegisterPage'
import {
  RegisterFormModel,
  RegisterFormModelColumn,
  RegisterFormModelInput,
  useCities,
  useStates,
} from '../../../components/RegisterFormModel'
import {SelectInput} from '../../../components/SelectInput'
import {validateCPF, validateEmail, validateCep} from 'validations-br'
import {useSelectedModule} from '../../../setup/redux/hooks'
import {Module} from '../auth/redux/AuthTypes'
import {masks} from '../../components/Form/FormInput'
import {FormError} from '../../../components/FormError'
import {divIcon} from 'leaflet'
import {CustomButton} from '../../components/CustomButton/CustomButton'

const userRegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Nome'),
  document: Yup.string().test('is-cnpj', 'CPF nao é valido', (value) => validateCPF(value || '')),
  email: Yup.string().test('is-email', 'Email não é valido', (value) => validateEmail(value || '')),
  street: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Endereço'),
  state: Yup.string().required('Necessário escolher UF'),
  number: Yup.string().max(50, 'Máximo de 50 caracteres').required('Necessário inserir Número'),
  neighborhood: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Bairro'),
  city: Yup.string().required('Necessário escolher Município'),
  phone: Yup.string().required('Necessário inserir Telefone'),
  zipcode: Yup.string().test('is-cep', 'CEP não é valido', (value) => validateCep(value || '')),
  secondaryPhone: Yup.string().required('Necessário inserir Telefone'),
})
const defaultInitialValues = {
  name: '',
  document: '',
  email: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  country: '',
  zipcode: '',
  phone: '',
  secondaryPhone: '',
  admPermission: false,
}

type ValueType = typeof defaultInitialValues
const AuditorRegisterForm: React.FC<{}> = () => {
  const [initialValues, setInitialValues] = React.useState(defaultInitialValues)
  const history = useHistory()
  const {id} = useParams<{id: string}>()
  const module = useSelectedModule()
  const entityId = useSelector<RootState>(({auth}) => auth.selectedEntity, shallowEqual) as string
  const [isLoading, setIsLoading] = useState(false)
  const [admPermission, setAdmPermission] = useState(false)

  useEffect(() => {
    if (id) {
      getUser(id, 6).then(({data: user}) => {
        setInitialValues({
          name: user.fullname ?? '',
          document: user.document ?? '',
          email: user.email ?? '',
          street: user.address?.street ?? '',
          number: user.address?.complement ?? '',
          neighborhood: user.address?.district ?? '',
          city: user.address?.cityId ?? '',
          state: user.address?.stateId ?? '',
          country: user.address?.country ?? '',
          zipcode: user.address?.zipcode ?? '',
          phone: user.phoneNumber ?? '',
          secondaryPhone: user.secondaryPhoneNumber ?? '',
          admPermission: admPermission,
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
        if (id) {
          await updateAuditorUser(
            id,
            {
              fullName: values.name,
              document: values.document,
              email: values.email,
              phoneNumber: values.phone,
              username: values.email,
              secondaryPhoneNumber: values.secondaryPhone,
              address: {
                street: values.street,
                district: values.neighborhood,
                complement: values.number,
                zipcode: values.zipcode,
                type: 1,
                cityId: values.city,
              },
            },
            entityId,
            module === Module.Auditor ? Module.Auditor : Module.ContribuinteDTE,
            admPermission ? true : false
          )
        } else {
          await createAuditorUser(
            {
              fullName: values.name,
              document: values.document,
              email: values.email,
              phoneNumber: values.phone,
              username: values.email,
              secondaryPhoneNumber: values.secondaryPhone,
              address: {
                street: values.street,
                district: values.neighborhood,
                complement: values.number,
                zipcode: values.zipcode,
                type: 1,
                cityId: values.city,
              },
            },
            entityId,
            module === Module.Auditor ? Module.Auditor : Module.ContribuinteDTE,
            admPermission ? true : false
          )
        }

        history.push(
          `${
            module == Module.Auditor
              ? '/auditor/administrativo/consulta-auditores'
              : '/ITR/ConsultAuditor'
          }`
        )
      } catch (err) {
        setStatus({message: err})
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <FormBody
      admPermission={admPermission}
      setAdmPermission={setAdmPermission}
      isLoading={isLoading}
      formik={formik}
    />
  )
}

const changeResponsibility = (responsibility: string) => {
  if (responsibility === 'Responsável Técnico') {
    return 'Auditor'
  }
  return 'Responsável Técnico'
}
type FormBodyProps = {
  formik: FormikProps<ValueType>
  isLoading: boolean
  admPermission: boolean
  setAdmPermission: (admPermission: boolean) => void
}
function FormBody(props: FormBodyProps) {
  const [responsibility, setResponsibility] = useState('Auditor')
  const states = useStates()
  const {id} = useParams<{id: string}>()
  const cities = useCities(props.formik.values.state)
  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>
              {id ? 'Editar Auditor Fiscal' : 'Cadastro de Auditor Fiscal'}
            </span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <RegisterFormModel
            footer={
              <div>
                <div className='p-10 d-flex flex-row justify-content-around'>
                  <CustomButton
                    label={id ? 'Editar' : 'Cadastrar'}
                    onSubmit={props.formik.handleSubmit}
                    disabled={props.isLoading}
                    isLoading={props.isLoading}
                  />
                </div>
                <FormError status={props.formik.status}></FormError>
              </div>
            }
            onSubmit={props.formik.handleSubmit}
          >
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Nome'
                id='inputName'
                placeholder='Insira o Nome'
                fieldProps={props.formik.getFieldProps('name')}
                touched={props.formik.touched.name}
                errors={props.formik.errors.name}
                type='name'
              />
              <RegisterFormModelInput
                label='CPF'
                id='inputCPF'
                placeholder='Ex.: 123456789-10'
                fieldProps={props.formik.getFieldProps('document')}
                touched={props.formik.touched.document}
                errors={props.formik.errors.document}
                type='document'
                mask={masks.cpf}
              />
              <RegisterFormModelInput
                label='Endereço'
                id='inputEndereco'
                placeholder='Ex.: Rua das Gaivotas'
                fieldProps={props.formik.getFieldProps('street')}
                touched={props.formik.touched.street}
                errors={props.formik.errors.street}
                type='street'
              />
              <SelectInput
                label='UF'
                fieldProps={props.formik.getFieldProps('state')}
                touched={props.formik.touched.state}
                errors={props.formik.errors.state}
                data={states}
              />
              <SelectInput
                label='Município'
                id='inputMunicipio'
                fieldProps={props.formik.getFieldProps('city')}
                touched={props.formik.touched.city}
                errors={props.formik.errors.city}
                data={cities}
              />
              <RegisterFormModelInput
                label='Número'
                id='inputNumber'
                placeholder='Ex.: 123'
                fieldProps={props.formik.getFieldProps('number')}
                touched={props.formik.touched.number}
                errors={props.formik.errors.number}
                type='number'
              />
            </RegisterFormModelColumn>

            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Email'
                id='inputEmail'
                placeholder='exemplo@email.com'
                fieldProps={props.formik.getFieldProps('email')}
                touched={props.formik.touched.email}
                errors={props.formik.errors.email}
                type='name'
              />
              <RegisterFormModelInput
                label='Celular'
                id='inputCelular'
                placeholder='(31) 9 9999-9999'
                fieldProps={props.formik.getFieldProps('phone')}
                touched={props.formik.touched.phone}
                errors={props.formik.errors.phone}
                mask={masks.phone}
                type='phone'
              />
              <RegisterFormModelInput
                label='CEP'
                placeholder='Ex.: 30672‑772'
                fieldProps={props.formik.getFieldProps('zipcode')}
                touched={props.formik.touched.zipcode}
                errors={props.formik.errors.zipcode}
                type='zipcode'
                mask={masks.cep}
              />
              <RegisterFormModelInput
                label='Outro Contato'
                id='inputCelular2'
                placeholder='(31) 9 9999-9999'
                fieldProps={props.formik.getFieldProps('secondaryPhone')}
                touched={props.formik.touched.secondaryPhone}
                errors={props.formik.errors.secondaryPhone}
                type='secondaryPhone'
                mask={masks.phone}
              />
              <RegisterFormModelInput
                label='Bairro'
                id='inputBairro'
                placeholder='Ex.: Vila Clóris'
                fieldProps={props.formik.getFieldProps('neighborhood')}
                touched={props.formik.touched.neighborhood}
                errors={props.formik.errors.neighborhood}
                type='neighborhood'
              />
              <label className='mt-13 form-check form-switch form-check-custom form-check-solid'>
                <input
                  onChange={() => {
                    props.setAdmPermission(!props.admPermission)
                    setResponsibility(changeResponsibility(responsibility))
                  }}
                  className='form-check-input w-30px h-20px'
                  type='checkbox'
                  value='1'
                  checked={props.admPermission}
                  name='notifications'
                />
                <strong className='form-check-label fs-7'>{responsibility}</strong>
              </label>
            </RegisterFormModelColumn>

            <RegisterFormImgColumn>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/illustrations/custom/adminRegisterIllustration.svg')}
                className='img-fluid'
              />
            </RegisterFormImgColumn>
          </RegisterFormModel>
        </div>
      </div>
    </>
  )
}

export default function AuditorRegister() {
  return <AuditorRegisterForm />
}

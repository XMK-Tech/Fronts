import {FieldInputProps, FormikProps, useField, useFormik} from 'formik'
import React, {useEffect} from 'react'
import * as Yup from 'yup'
import {useHistory, useParams} from 'react-router-dom'
import {validateCPF, validateEmail, validateUF, validateCep, validatePhone} from 'validations-br'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {createAdminUser, getUser, updateAdminUser} from '../../../../services/UsersApi'
import {
  RegisterFormModel,
  RegisterFormModelColumn,
  RegisterFormModelInput,
  useCities,
  useStates,
} from '../../../../../components/RegisterFormModel'
import {SelectInput} from '../../../../../components/SelectInput'

export type UserInfoCardProps = {
  label: string
  placeholder: string
  id?: string
  fieldProps?: FieldInputProps<any>
  className?: string
}
export type Item = {
  id: string
  label: string
}
export type RegisterFormDropdownProps = {
  items: Item[]
  label: string
  placeholder: string
  id?: string
  fieldProps?: FieldInputProps<any>
}
export type RegisterFormProps = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  footer?: React.ReactNode
}

export const RegisterForm: React.FC<RegisterFormProps> = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div className=' shadow rounded bg-light '>
        <div className='p-10'>
          <div className='d-flex flex-row justify-content-between'>{props.children}</div>
        </div>
      </div>
      {!!props.footer && props.footer}
    </form>
  )
}

export const RegisterFormInput: React.FC<UserInfoCardProps> = ({
  fieldProps,
  label,
  placeholder,
  className,
}) => {
  return (
    <div className='py-3'>
      <strong className=''>{label}</strong>
      <input
        className={className ? className : ' mw-300px shadow form-control'}
        type={'text'}
        placeholder={placeholder}
        {...fieldProps}
      />
    </div>
  )
}
export const RegisterFormTextArea: React.FC<UserInfoCardProps> = ({
  fieldProps,
  label,
  placeholder,
}) => {
  return (
    <div className='py-3'>
      <strong className=''>{label}</strong>
      <textarea
        className=' h-150px w-400px shadow form-control'
        placeholder={placeholder}
        {...fieldProps}
      />
    </div>
  )
}
export const RegisterFormDropdown: React.FC<RegisterFormDropdownProps> = ({
  fieldProps,
  label,
  placeholder,
}) => {
  return (
    <div className='py-3'>
      <strong className=''>{label}</strong>
      <input
        className=' mw-300px shadow form-control'
        type={'text'}
        placeholder={placeholder}
        {...fieldProps}
      />
    </div>
  )
}

export const RegisterFormColumn: React.FC<{className?: string; id?: string}> = (props) => {
  return (
    <div
      className={` px-4 d-flex flex-column justify-content-start mw-380px ${props.className ?? ''}`}
    >
      {props.children}
    </div>
  )
}
export const RegisterFormImgColumn: React.FC<{}> = (props) => {
  return <div className=' px-4 flex-grow-1 d-flex flex-column '>{props.children}</div>
}
const adminRegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Nome'),
  document: Yup.string().test('is-cpf', 'CPF nao é valido', (value) => validateCPF(value || '')),
  street: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Endereço'),
  UF: Yup.string().required('Necessário escolher UF'),
  city: Yup.string().required('Necessário escolher Município'),
  email: Yup.string().test('is-email', 'E-mail nao é valido', (value) =>
    validateEmail(value || '')
  ),
  phone: Yup.string().test('is-phone', 'Telefone nao é valido', (value) =>
    validatePhone(value || '')
  ),
  zipcode: Yup.string().test('is-cep', 'CEP nao é valido', (value) => validateCep(value || '')),
  neighborhood: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Bairro'),
  number: Yup.string().max(50, 'Máximo de 50 caracteres').required('Necessário inserir Número'),
})
const defaultInitialValues = {
  name: '',
  document: '',
  email: '',
  street: '',
  number: '',
  zipcode: '',
  neighborhood: '',
  UF: '',
  city: '',
  phone: '',
}

type ValueType = typeof defaultInitialValues
const UserTable: React.FC<{}> = () => {
  const [initialValues, setInitialValues] = React.useState(defaultInitialValues)
  const history = useHistory()
  const {id} = useParams<{id: string}>()
  useEffect(() => {
    if (id) {
      getUser(id, 6).then(({data: user}) => {
        setInitialValues({
          name: user.username,
          document: user.document,
          email: user.email,
          street: user.street,
          number: user.number,
          zipcode: user.zipcode,
          neighborhood: user.neighborhood,
          UF: user.UF,
          city: user.city,
          phone: user.phoneNumber,
        })
      })
    }
  }, [id])
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: adminRegisterSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (id) {
        await updateAdminUser(id, {
          fullName: values.name,
          email: values.email,
          document: values.document,
          phoneNumber: Number(values.phone),
          username: values.email,
          address: {
            street: values.street,
            district: values.neighborhood,
            complement: '',
            zipcode: values.zipcode,
            type: 1,
            cityId: values.city,
          },
        })
      } else {
        await createAdminUser({
          fullName: values.name,
          email: values.email,
          document: values.document,
          phoneNumber: Number(values.phone),
          username: values.email,
          address: {
            street: values.street,
            district: values.neighborhood,
            complement: '',
            zipcode: values.zipcode,
            type: 1,
            cityId: values.city,
          },
        })
      }
      history.push('/admin/consulta/admin')
    },
  })
  return <FormBody formik={formik} />
}

function FormBody({formik}: {formik: FormikProps<ValueType>}) {
  const states = useStates()
  const cities = useCities(formik.values.UF)
  const {id} = useParams<{id: string}>()

  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>
              {id ? 'Editar Administrador' : 'Cadastro de Administradores'}
            </span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <RegisterFormModel
            footer={
              <div className='p-10 d-flex flex-row justify-content-around'>
                <button type='submit' className='btn btn-sm btn-primary'>
                  Salvar
                </button>
              </div>
            }
            onSubmit={formik.handleSubmit}
          >
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Nome'
                id='inputName'
                placeholder='Insira o Nome'
                fieldProps={formik.getFieldProps('name')}
                touched={formik.touched.name}
                errors={formik.errors.name}
                type='name'
              />
              <RegisterFormModelInput
                label='CPF'
                id='inputCPF'
                placeholder='Ex.: 123456789-10'
                fieldProps={formik.getFieldProps('document')}
                touched={formik.touched.document}
                errors={formik.errors.document}
                type='document'
              />
              <RegisterFormModelInput
                label='Endereço'
                id='inputEndereco'
                placeholder='Ex.: Rua das Gaivotas'
                fieldProps={formik.getFieldProps('street')}
                touched={formik.touched.street}
                errors={formik.errors.street}
                type='street'
              />
              <SelectInput
                label='UF'
                fieldProps={formik.getFieldProps('UF')}
                touched={formik.touched.UF}
                errors={formik.errors.UF}
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
            </RegisterFormModelColumn>
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Email'
                id='inputEmail'
                placeholder='exemplo@email.com'
                fieldProps={formik.getFieldProps('email')}
                touched={formik.touched.email}
                errors={formik.errors.email}
                type='email'
              />
              <RegisterFormModelInput
                label='Celular'
                id='inputCelular'
                placeholder='(31) 9 9999-9999'
                fieldProps={formik.getFieldProps('phone')}
                touched={formik.touched.phone}
                errors={formik.errors.phone}
                type='phone'
              />
              <RegisterFormModelInput
                label='CEP'
                placeholder='Ex.: 30672‑772'
                fieldProps={formik.getFieldProps('zipcode')}
                touched={formik.touched.zipcode}
                errors={formik.errors.zipcode}
                type='zipcode'
              />
              <RegisterFormModelInput
                label='Bairro'
                id='inputBairro'
                placeholder='Ex.: Vila Clóris'
                fieldProps={formik.getFieldProps('neighborhood')}
                touched={formik.touched.neighborhood}
                errors={formik.errors.neighborhood}
                type='neighborhood'
              />
              <RegisterFormModelInput
                label='Número'
                id='inputNumber'
                placeholder='Ex.: 123'
                fieldProps={formik.getFieldProps('number')}
                touched={formik.touched.number}
                errors={formik.errors.number}
                type='street'
              />
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

function AdminRegister() {
  return <UserTable />
}

export default AdminRegister

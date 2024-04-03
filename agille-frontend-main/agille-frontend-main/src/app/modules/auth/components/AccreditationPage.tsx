import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {Link, useHistory, useParams} from 'react-router-dom'
import {useFormik} from 'formik'
import {validateEmail, validateCNPJ} from 'validations-br'
import {
  RegisterFormModel,
  RegisterFormModelColumn,
  RegisterFormModelInput,
  useCities,
  useStates,
} from '../../../../components/RegisterFormModel'

import {CustomButton} from '../../../components/CustomButton/CustomButton'

import {ITRRegisterFormInputDropdown} from '../../ITR/Components/ITRRegisterForm'
import {masks} from '../../../components/Form/FormInput'
import {useChangeEntities} from '../../../../setup/redux/hooks'

const accreditationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Nome'),
  email: Yup.string().test('is-email', 'Email não é valido', (value) => validateEmail(value || '')),
  document: Yup.string().test('is-cnpj', 'CNPJ não é valido', (value) => validateCNPJ(value || '')),
  state: Yup.string().required('Necessário inserir Estado'),
  county: Yup.string().required('Necessário inserir Município'),
  phone: Yup.string().required('Necessário inserir Telefone'),
  street: Yup.string().required('Necessário inserir Rua'),
  number: Yup.string().required('Necessário inserir Número'),
  cep: Yup.string().required('Necessário inserir CEP'),
  district: Yup.string().required('Necessário inserir Bairro'),
})

const initialValues = {
  name: '',
  email: '',
  city: '',
  document: '',
  county: '',
  state: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  district: '',
}

export default function ManualAccreditationPage() {
  return <AccreditationForm />
}

export function AccreditationPage() {
  const {id} = useParams<{id?: string}>()
  useEffect(() => {
    if (id) {
      changeEntities(id)
    }
  }, [id])

  const {changeEntities} = useChangeEntities()

  return <AccreditationForm showCancel />
}
function AccreditationForm(props: {showCancel?: boolean}) {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: accreditationSchema,
    onSubmit: (values, {setSubmitting}) => {
      setLoading(true)
      setLoading(false)
      setSubmitting(false)
    },
  })
  const states = useStates('agille')
  const cities = useCities(formik.values.state, 'agille')
  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Credenciamento CDC</span>
        </h3>
      </div>
      <div className='card-body'>
        <RegisterFormModel onSubmit={formik.handleSubmit}>
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
              id='inputDocument'
              placeholder='Insira o CPF'
              fieldProps={formik.getFieldProps('document')}
              touched={formik.touched.document}
              errors={formik.errors.document}
              type='document'
              mask={masks.cpf}
            />
            <RegisterFormModelInput
              label='Email'
              id='inputEmail'
              placeholder='Insira o Email'
              fieldProps={formik.getFieldProps('email')}
              touched={formik.touched.email}
              errors={formik.errors.email}
              type='email'
            />
            <RegisterFormModelInput
              label='Telefone'
              placeholder='Insira o Telefone'
              fieldProps={formik.getFieldProps('phone')}
              touched={formik.touched.phone}
              errors={formik.errors.phone}
              type='phone'
              mask={masks.phone}
            />
          </RegisterFormModelColumn>
          <RegisterFormModelColumn>
            <RegisterFormModelInput
              label='CEP'
              placeholder='Insira o CEP'
              fieldProps={formik.getFieldProps('cep')}
              touched={formik.touched.cep}
              errors={formik.errors.cep}
              type='CEP'
              mask={masks.cep}
            />
            <ITRRegisterFormInputDropdown
              label='Estado'
              placeholder='Insira o Estado'
              fieldProps={formik.getFieldProps('state')}
              touched={formik.touched.state}
              errors={formik.errors.state}
              type='state'
              data={states}
            />
            <ITRRegisterFormInputDropdown
              label='Municipio'
              placeholder='Insira o Municipio'
              fieldProps={formik.getFieldProps('county')}
              touched={formik.touched.county}
              errors={formik.errors.county}
              type='county'
              data={cities}
            />
          </RegisterFormModelColumn>
          <RegisterFormModelColumn>
            <RegisterFormModelInput
              label='Bairro'
              placeholder='Insira o Bairro'
              fieldProps={formik.getFieldProps('district')}
              touched={formik.touched.district}
              errors={formik.errors.district}
              type='district'
            />
            <RegisterFormModelInput
              label='Logradouro'
              placeholder='Insira o Logradouro'
              fieldProps={formik.getFieldProps('street')}
              touched={formik.touched.street}
              errors={formik.errors.street}
              type='street'
            />
            <RegisterFormModelInput
              label='Número'
              placeholder='Insira o Número'
              fieldProps={formik.getFieldProps('number')}
              touched={formik.touched.number}
              errors={formik.errors.number}
              type='number'
            />
          </RegisterFormModelColumn>
        </RegisterFormModel>

        <div className='card-footeer'>
          <div className='d-flex flex-wrap justify-content-center m-10'>
            {props.showCancel && (
              <Link to='/auth/login'>
                <button
                  type='button'
                  id='kt_login_password_reset_form_cancel_button'
                  className='btn btn-light-primary fw-bolder mx-4'
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Cancelar
                </button>
              </Link>
            )}
            <CustomButton
              label={'Salvar'}
              onSubmit={() => {}}
              isLoading={loading}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

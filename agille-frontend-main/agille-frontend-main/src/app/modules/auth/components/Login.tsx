import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useHistory} from 'react-router-dom'
import {useFormik} from 'formik'
import * as auth from '../redux/AuthRedux'
import {login} from '../redux/AuthCRUD'
import {Permission} from '../redux/AuthTypes'
import {FormError} from '../../../../components/FormError'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato inválido de Email')
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Email'),
  password: Yup.string()

    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir senha'),
})

const initialValues = {
  email: '',
  password: '',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      //Chamando api
      login(values.email, values.password)
        .then(({data: content}) => {
          setLoading(false)
          dispatch(
            auth.actions.login(
              content.token,
              content.permissions.map(
                (perm: any): Permission => ({
                  entityId: perm.permissionEntity,
                  franchiseId: perm.permissionFranchise,
                  isGlobal: perm.isGlobal,
                  name: perm.permissionName,
                })
              ),
              content.franchises,
              content.entities
            )
          )
        })
        .catch((e) => {
          setLoading(false)
          setSubmitting(false)
          setStatus({message: 'Confira os dados e tente novamente.'})
        })
    },
  })

  const certificateUrl = window.location.origin.includes('agille.digital')
    ? 'https://certificate.agille.digital'
    : 'https://certificate.agiprev.digital'
  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Login</h1>
        <div className='text-gray-400 fw-bold fs-4'>
          Entre com sua <strong className='text-black'>Conta</strong>
        </div>
      </div>
      {/* begin::Heading */}
      <FormError status={formik.status} />
      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
        <input
          placeholder='Digite seu e-mail'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex mb-2'>
            <div>
              {/* begin::Label */}
              <label className='form-label fw-bolder text-dark fs-6 mb-0'>Senha</label>
              {/* end::Label */}
            </div>
          </div>
          <div>
            {/* begin::Link */}
            <Link to='/auth/forgot-password' className='link-primary fs-6 fw-bolder'>
              Esqueceu a Senha?
            </Link>
            {/* end::Link */}
          </div>
        </div>
        <input
          type='password'
          placeholder='Digite sua senha...'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Action */}
      <div className='text-center'>
        {/* <Link to='/auth/dashboard'> */}
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary mb-5 w-200px'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Entrar</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Fazendo login...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        {/* </Link> */}
      </div>
      {/* end::Action */}
      {/* begin::Heading */}
      <div className='text-center mb-10'>
        <div className='text-gray-400 fw-bold fs-6'>
          <Link to='/auth/first-access' className='link-primary fw-bolder'>
            Realizar Primeiro Acesso
          </Link>
        </div>

        {false && (
          <div className='text-gray-400 fw-bold fs-6'>
            <Link to='/auth/AccreditationPage' className='link-primary fw-bolder'>
              Credenciar Usuário
            </Link>
          </div>
        )}
        <div className='text-gray-400 fw-bold fs-6'>
          {/* TODO: Make URL dynamic */}
          <a href={certificateUrl} className='link-primary fw-bolder'>
            Acesse com certificado digital
          </a>
        </div>
      </div>
    </form>
  )
}

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {validate} from '../redux/AuthCRUD'
import {Link, useHistory} from 'react-router-dom'

const initialValues = {
  email: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato inválido de Email')
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 3 caracteres')
    .required('Necessário inserir Email'),

  acceptTerms: Yup.bool().required('Você deve aceitar os termos e condições'),
})

export function FirstAccess() {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      if (!values.acceptTerms) {
        setStatus('Você deve aceitar os termos.')
        return
      }
      setLoading(true)
      validate(values.email)
        .then(() => {
          setLoading(false)
          history.push('/auth/first-access-code?email=' + values.email)
        })
        .catch(() => {
          setLoading(false)
          setSubmitting(false)
          setStatus('Falha no registro')
        })
    },
  })

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='mb-10 text-center'>
        {/* begin::Title */}
        <h1 className='text-dark mb-3'>Deseja realizar o primeiro acesso?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-600 fw-bold fs-4'>
          Insira seu <strong className='text-black'>email</strong> para prosseguir
        </div>
        {/* end::Link */}
      </div>
      {/* end::Heading */}

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Email */}
      <div className='fv-row mb-7'>
        <label className='form-label fw-bolder text-dark fs-6'>Email</label>
        <input
          placeholder='Email'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}
      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='form-check form-check-custom form-check-solid'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <label
            className='form-check-label fw-bold text-gray-700 fs-6'
            htmlFor='kt_login_toc_agree'
          >
            Eu aceito os{' '}
            <Link to='/auth/terms' className='ms-1 link-primary'>
              termos e condições
            </Link>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* end::Form group */}
      {/* begin::Form group */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary fw-bolder me-4'
          disabled={!formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Enviar</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Carregando...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-2 '
          >
            Cancelar
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  )
}

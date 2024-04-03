import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {useFormik} from 'formik'
import {changePassword} from '../redux/AuthCRUD'

const initialValues = {
  password: '',
  passwordConfirm: '',
}

const forgotPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Mínimo de 8 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Senha'),
  passwordConfirm: Yup.string()
    .min(8, 'Mínimo de 8 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Senha de Confirmação'),
})

export function ChangePassword() {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      const {email, code} = location.state as any
      changePassword(email, code, values.password)
        .then(() => {
          setHasErrors(false)
          setLoading(false)
          history.push('/auth/login')
        })
        .catch(() => {
          setHasErrors(true)
          setLoading(false)
          setSubmitting(false)
          setStatus('Dados de login incorretos')
        })
    },
  })

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark mb-3 fs-1'>Alterar senha</h1>
          {/* end::Title */}
          <br />
          <br />

          {/* begin::Link */}
          <div className='text-gray-600 fw-bold fs-5'>
            Crie uma nova <strong className='text-black'>senha</strong> forte, que não utilize para
            outros <strong className='text-black'>Websites</strong>.
          </div>
          {/* end::Link */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
              Nos desculpe, houve um erro ao tentar realizar a ação, favor tentar novamente.
            </div>
          </div>
        )}
        {/* end::Title */}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Alterar senha</label>
          <input
            type='password'
            placeholder='Digite sua nova senha'
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.password && formik.errors.password},
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
        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Confirmar</label>
          <input
            type='password'
            placeholder='Confirme sua nova senha'
            autoComplete='off'
            {...formik.getFieldProps('passwordConfirm')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.passwordConfirm && formik.errors.passwordConfirm},
              {
                'is-valid': formik.touched.passwordConfirm && !formik.errors.passwordConfirm,
              }
            )}
          />
          <p className='text-gray-600 fw-bolder'>Mínimo de 8 caracteres</p>
          {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.passwordConfirm}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-end pb-lg-0 '>
          <button
            type='submit'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-lg btn-primary fw-bolder me-4 '
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Próximo
          </button>
        </div>
        {/* end::Form group */}
      </form>
    </>
  )
}

import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {useFormik} from 'formik'
import {validatePasswordToken} from '../redux/AuthCRUD'
import {useHistory} from 'react-router-dom'
import {useQuery} from '../../../../setup/useQuery'

const initialValues = {
  code: '',
}

const forgotPasswordSchema = Yup.object().shape({
  code: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir código'),
})
export function FirstAcessCode() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const query = useQuery()
  const history = useHistory()
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      const email = query.get('email') || ''
      validatePasswordToken(values.code, email)
        .then(() => {
          setHasErrors(false)
          setLoading(false)
          history.push('/auth/create-password', {
            email: email,
            code: values.code,
          })
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
          <h1 className='text-dark mb-3 fs-1'>Código de Acesso</h1>
          {/* end::Title */}

          {/* begin::Description */}
          <br />

          <div className='text-gray-600 fw-bold fs-4'>
            Este processo ajuda a verificar e <br /> proteger seu acesso.
          </div>
          <br />
          <br />
          <div className='text-gray-600 fw-bold fs-4'>
            Por favor, digite o código que foi enviado ao seu{' '}
            <strong className='text-black'>email</strong>
          </div>
          {/* end::Description */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
              Nos desculpe, houve um erro ao tentar realizar a ação, favor tentar novamente.
            </div>
          </div>
        )}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Código</label>
          <input
            type='code'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('code')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.code && formik.errors.code},
              {
                'is-valid': formik.touched.code && !formik.errors.code,
              }
            )}
          />
          {formik.touched.code && formik.errors.code && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.code}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button
            type='submit'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-lg btn-primary fs-6'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Próximo
          </button>{' '}
        </div>
        {/* end::Form group */}
      </form>
    </>
  )
}

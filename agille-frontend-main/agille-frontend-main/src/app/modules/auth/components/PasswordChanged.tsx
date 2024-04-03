import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'

const initialValues = {
  code: '',
}

const forgotPasswordSchema = Yup.object().shape({
  code: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir código'),
})

export function PasswordChanged() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {},
  })

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark mb-3 fs-1'>Sua senha foi alterada com Sucesso !</h1>
          {/* end::Title */}

          {/* begin::Description */}
          <br />

          <br />
          <br />
          <div className='text-gray-600 fw-bold fs-4'>
            Entre novamente com seu <strong className='text-black'>email</strong> e com sua nova{' '}
            <strong className='text-black'>senha</strong> para fazer login
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
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-lg btn-primary fs-6'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Fazer Login
            </button>{' '}
          </Link>
        </div>
        {/* end::Form group */}
      </form>
    </>
  )
}

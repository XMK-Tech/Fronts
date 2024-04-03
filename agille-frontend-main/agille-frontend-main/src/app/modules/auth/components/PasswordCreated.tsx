import React, {useState} from 'react'
import {Link} from 'react-router-dom'

export function PasswordCreated() {
  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark mb-3 fs-1'>Sua cadastro foi realizado com Sucesso !</h1>
          {/* end::Title */}

          {/* begin::Description */}
          <br />

          <br />
          <br />
          <div className='text-gray-600 fw-bold fs-4'>
            Entre com seu <strong className='text-black'>email</strong> e com sua{' '}
            <strong className='text-black'>senha</strong> para fazer login
          </div>
          {/* end::Description */}
        </div>

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-lg btn-primary fs-6'
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

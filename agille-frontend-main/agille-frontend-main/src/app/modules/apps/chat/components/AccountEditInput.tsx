import clsx from 'clsx'
import React from 'react'
import {SelectInput} from '../../../../../components/SelectInput'

type AccountEditInputProps = {
  type?: 'input' | 'select' | undefined
  label: string
  fieldProps?: any
  className?: string
  touched?: boolean
  error?: string
  errors?: any
  placeholder?: string
  mask?: any
  data?: {id: string; name: string}[] | undefined
}

export default function AccountEditInput(props: AccountEditInputProps) {
  const styleInputAccount = clsx(
    props.className ? props.className : 'w-450px shadow form-control',
    {
      'is-invalid': props.touched && props.errors,
    },
    {
      'is-valid': props.touched && !props.errors,
    }
  )
  return (
    <>
      <div className='row mb-6 '>
        <strong className='col-lg-4 col-form-label fw-bold fs-6'>{props.label}</strong>

        <div className='col-lg-8'>
          {props.type === 'select' ? (
            <SelectInput
              label=''
              fieldProps={props.fieldProps}
              errors={props.error}
              touched={props.touched}
              data={props.data}
              className={styleInputAccount}
            />
          ) : (
            <input
              {...props.fieldProps}
              className={styleInputAccount}
              type={'text'}
              placeholder={props.placeholder}
            />
          )}

          {props.touched && props.errors && (
            <div className='fv-plugins-message-container'>
              <span role='alert'>{props.errors}</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

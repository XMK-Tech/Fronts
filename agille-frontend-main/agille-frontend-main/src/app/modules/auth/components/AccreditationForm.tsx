import {FieldInputProps} from 'formik'
import {useFormik} from 'formik'
import React, {useState} from 'react'
import clsx from 'clsx'

export type UserInfoCardProps = {
  touched?: boolean
  errors?: string
  type: string
  label: string
  placeholder: string
  id?: string
  fieldProps?: FieldInputProps<any>
  className?: string
}

export const AccreditationFormInput: React.FC<UserInfoCardProps> = ({
  touched,
  errors,
  type,
  fieldProps,
  label,
  placeholder,
  className,
}) => {
  return (
    <div className='fv-row mb-10'>
      <label className='form-label fw-bolder text-gray-900 fs-6'>{label}</label>
      <input
        placeholder={placeholder}
        {...fieldProps}
        className={clsx(
          className ? className : 'form-control form-control-lg form-control-solid',
          {
            'is-invalid': touched && errors,
          },
          {
            'is-valid': touched && !errors,
          }
        )}
        type={type}
      />
      {touched && errors && (
        <div className='fv-plugins-message-container'>
          <div className='fv-help-block'>
            <span role='alert'>{errors}</span>
          </div>
        </div>
      )}
    </div>
  )
}

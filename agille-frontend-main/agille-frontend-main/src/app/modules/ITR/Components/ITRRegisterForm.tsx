import {FieldInputProps, FormikProps} from 'formik'
import clsx from 'clsx'
import React from 'react'
import SelectModel from '../../../../components/SelectModel'
import {SelectInput} from '../../../../components/SelectInput'
import {MaskedInput} from '../../../components/Form/FormInput'

export type RegisterFormProps = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  footer?: React.ReactNode
}

export const ITRRegisterForm: React.FC<RegisterFormProps> = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div className=' shadow rounded bg-light m-15'>
        <div className='p-10'>
          <div className='d-flex flex-row justify-content-between'>{props.children}</div>
        </div>
      </div>
      {!!props.footer && props.footer}
    </form>
  )
}

export const ITRRegisterFormColumn: React.FC<{}> = (props) => {
  return (
    <div className=' px-4 flex-grow-1 d-flex flex-column justify-content-start'>
      {props.children}
    </div>
  )
}

export type UserInfoCardProps = {
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  touched?: boolean
  errors?: string
  type: string
  label: string
  placeholder: string
  id?: string
  fieldProps?: FieldInputProps<any>
  className?: string
  data?: {id: string; name: string}[]
  mask?: string | Function
}

export const ITRRegisterFormInput: React.FC<UserInfoCardProps> = ({
  touched,
  errors,
  type,
  fieldProps,
  label,
  placeholder,
  className,
  mask,
}) => {
  return (
    <div className='py-3'>
      <strong className=''>{label}</strong>
      <MaskedInput
        placeholder={placeholder}
        fieldProps={fieldProps}
        className={className}
        type={type}
        label={label}
        mask={mask}
      />
      {touched && errors && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{errors}</span>
        </div>
      )}
    </div>
  )
}

export type UserInfoCardSwitchProps = {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label: string
  touched?: boolean
  errors?: string
  fieldProps?: FieldInputProps<any>
  formik?: FormikProps<any>
}

export const ITRRegisterFormInputDropdown: React.FC<UserInfoCardProps> = ({
  touched,
  errors,
  fieldProps,
  label,
  className,
  data,
  onChange,
}) => {
  return (
    <SelectInput
      onChange={onChange}
      errors={errors}
      label={label}
      data={data}
      className={className}
      fieldProps={fieldProps}
      touched={touched}
    ></SelectInput>
  )
}

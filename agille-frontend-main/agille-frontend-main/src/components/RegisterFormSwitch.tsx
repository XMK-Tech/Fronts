import React from 'react'
import {boolean} from 'yup'
import {UserInfoCardSwitchProps} from '../app/modules/ITR/Components/ITRRegisterForm'

export const RegisterCheckboxInput = ({
  onCheckedChange,
  checked,
}: {
  onCheckedChange: (value: boolean) => void
  checked: boolean
}) => (
  <input
    onChange={() => {
      onCheckedChange?.(!checked)
    }}
    className='form-check-input'
    type='checkbox'
    checked={checked}
  />
)
export const RegisterFormCheckbox: React.FC<UserInfoCardSwitchProps> = ({
  checked,
  onCheckedChange,
  label,
}) => {
  return (
    <div className={`d-flex flex-row justify-content-center `}>
      <label
        className='form-check form-switch form-check-custom form-check-solid'
        style={{height: '40px'}}
      >
        <strong className='me-7' style={{width: '188px'}}>
          {label}
        </strong>
        <input
          onChange={() => {
            onCheckedChange?.(!checked)
          }}
          className='form-check-input w-30px h-20px'
          type='checkbox'
          checked={checked}
        />
        <strong className='ml-12 form-check-label fs-7'>{checked ? 'Sim' : 'Não'}</strong>
      </label>
    </div>
  )
}

export const RegisterFormSwitch: React.FC<UserInfoCardSwitchProps> = ({
  touched,
  errors,
  fieldProps,
  checked,
  onCheckedChange,
  label,
}) => {
  const isChecked = checked ?? fieldProps?.value
  return (
    <div className='d-flex flex-row'>
      <label
        className='form-check form-switch form-check-custom form-check-solid'
        style={{height: '40px'}}
      >
        <strong className='me-7' style={{width: '188px'}}>
          {label}
        </strong>
        <input
          onChange={() => {
            onCheckedChange?.(!checked)
          }}
          className='form-check-input w-30px h-20px'
          {...fieldProps}
          checked={isChecked}
          type='checkbox'
        />
        <strong className='ml-12 form-check-label fs-7'>{isChecked ? 'Sim' : 'Não'}</strong>
      </label>
    </div>
  )
}

export const RegisterFormRadio: React.FC<UserInfoCardSwitchProps> = ({
  touched,
  errors,
  fieldProps,
  checked,
  onCheckedChange,
  label,
  formik,
}) => {
  const isChecked = checked ?? fieldProps?.value

  const changeValue = (value: boolean) => {
    onCheckedChange?.(value)
    fieldProps && formik?.setFieldValue?.(fieldProps?.name, value)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const strValue = event.target.value
    const value = strValue === 'true'
    changeValue(value)
  }
  return (
    <div className='d-flex align-items-center '>
      <div className='form-check form-check-custom form-check-solid'>
        <strong className='me-7' style={{width: '188px'}}>
          {label}
        </strong>
        <div className='me-8 my-8'>
          <input
            {...fieldProps}
            onChange={handleChange}
            className='form-check-input h-20px w-20px'
            type='radio'
            value={'true'}
            checked={fieldProps?.value === true}
          />
          <label onClick={() => changeValue(true)} className='form-check-label'>
            <strong>Sim</strong>
          </label>
        </div>
        <div className='me-8 my-8'>
          <input
            {...fieldProps}
            onChange={handleChange}
            className='form-check-input h-20px w-20px'
            type='radio'
            value={'false'}
            checked={fieldProps?.value === false}
          />
          <label onClick={() => changeValue(false)} className='form-check-label'>
            <strong>Não</strong>
          </label>
        </div>
      </div>
    </div>
  )
}

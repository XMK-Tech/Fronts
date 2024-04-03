import clsx from 'clsx'
import React from 'react'
import {SelectProps} from './RegisterFormModel'

export const SelectInput: React.FC<SelectProps> = ({
  touched,
  errors,
  fieldProps,
  label,
  className,
  data,
  disabled,
  onChange,
}) => {
  return (
    <div className='py-3'>
      <strong className=''>{label}</strong>
      <select
        onChange={onChange}
        disabled={disabled}
        {...fieldProps}
        className={clsx(
          className ? className : 'mw-300px shadow form-control',
          {
            'is-invalid': touched && errors,
          },
          {
            'is-valid': touched && !errors,
          }
        )}
      >
        <option value=''>Selecione</option>
        {data?.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
      {touched && errors && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{errors}</span>
        </div>
      )}
    </div>
  )
}

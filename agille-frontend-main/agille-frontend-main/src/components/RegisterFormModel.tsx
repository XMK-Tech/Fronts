import {FieldInputProps, FormikErrors, FormikTouched} from 'formik'
import clsx from 'clsx'
import React, {useEffect} from 'react'
import {FetchFrom, getCities, getStates} from '../app/services/statesApi'
import {MaskedInput} from '../app/components/Form/FormInput'
import {FormError} from './FormError'

export type RegisterFormProps = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  footer?: React.ReactNode
  status?: any
  className?: string
}

export type UserInfoCardProps = {
  touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined
  errors: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined
  type: string
  label: string
  placeholder: string
  id?: string
  fieldProps?: FieldInputProps<any>
  className?: string
  style?: React.CSSProperties
  mask?: string | Function
  textArea?: boolean
}

export type SelectProps = {
  touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined
  errors: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined
  label: string
  id?: string
  fieldProps?: FieldInputProps<any>
  className?: string
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLSelectElement> | undefined
  data?: {
    id: string
    name: string
  }[]
}

export const RegisterFormModel: React.FC<RegisterFormProps> = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div className=' shadow rounded bg-light'>
        <div className='p-10'>
          <div className={props.className || 'd-flex flex-row justify-content-between'}>
            {props.children}
          </div>
        </div>
      </div>
      <FormError status={props.status} />
      {!!props.footer && props.footer}
    </form>
  )
}
type RegisterFormModelColumnProps = {
  children: React.ReactNode
  container?: 'start' | 'center' | 'end'
}
export const RegisterFormModelColumn = (props: RegisterFormModelColumnProps) => {
  return (
    <div
      className={`px-4 flex-grow-1 d-flex flex-column justify-content-${
        props.container || 'start'
      }`}
    >
      {props.children}
    </div>
  )
}

export const RegisterFormModelInput: React.FC<UserInfoCardProps> = ({
  touched,
  errors,
  type,
  fieldProps,
  label,
  placeholder,
  className,
  mask,
  style,
}) => {
  return (
    <div className='py-3'>
      <strong className=''>{label}</strong>
      <MaskedInput
        placeholder={placeholder}
        fieldProps={fieldProps}
        className={className}
        style={style}
        type={type}
        touched={touched}
        errors={errors}
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
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

export const RegisterFormModelSwitch: React.FC<UserInfoCardSwitchProps> = ({
  checked,
  onCheckedChange,
  label,
}) => {
  return (
    <div className='d-flex flex-row justify-content-center mw-300px' style={{paddingTop: '30px'}}>
      <label
        className='form-check form-switch form-check-custom form-check-solid'
        style={{height: '40px'}}
      >
        <strong className='me-7' style={{width: '188px'}}>
          {label}
        </strong>
        <input
          onChange={() => {
            onCheckedChange(!checked)
          }}
          className='form-check-input w-30px h-20px'
          type='checkbox'
          value='1'
          checked={checked}
          
        />
        <strong className='ml-12 form-check-label fs-7'>{checked ? 'Sim' : 'Não'}</strong>
      </label>
    </div>
  )
}

export const RegisterFormModelInputType: React.FC<UserInfoCardProps> = ({
  touched,
  errors,
  fieldProps,
  label,
  className,
}) => {
  return (
    <div className='py-3'>
      <strong className=''>{label}</strong>
      <select
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
        <option value='A'>Apple</option>
        <option value='B'>Banana</option>
        <option value='C'>Cranberry</option>
      </select>
      {touched && errors && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{errors}</span>
        </div>
      )}
    </div>
  )
}

export const RegisterFormModelInputOwner: React.FC<UserInfoCardProps> = ({
  touched,
  errors,
  fieldProps,
  label,
  className,
}) => {
  return (
    <div className='py-3'>
      <strong className=''>{label}</strong>
      <select
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
        <option value='A'>Apple</option>
        <option value='B'>Banana</option>
        <option value='C'>Cranberry</option>
      </select>
      {touched && errors && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{errors}</span>
        </div>
      )}
    </div>
  )
}

export function useStates(fetchFrom: FetchFrom = 'middleware') {
  const [states, setStates] = React.useState<SelectProps['data']>([])
  useEffect(() => {
    getStates(fetchFrom)
      .then((res) => setStates && setStates(res.data))
      .catch((err) => console.error(err))
  }, [])
  return states
}

export function useCities(
  state: string,
  fetchFrom: FetchFrom = 'middleware',
  handleStateChange?: () => void
) {
  const [cities, setCities] = React.useState<SelectProps['data'] & {stateId: string}[]>([])
  useEffect(() => {
    if (state) {
      getCities(state, fetchFrom).then(
        (res) => setCities && setCities(res.data.map((city: any) => ({...city, stateId: state})))
      )
    } else {
      setCities([])
    }
  }, [state])
  useEffect(() => {
    if (cities.length && cities[0].stateId !== state) {
      handleStateChange?.()
    }
  }, [state])
  return cities
}

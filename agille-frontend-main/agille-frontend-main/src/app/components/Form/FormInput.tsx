import clsx from 'clsx'
import {FieldInputProps, FormikErrors, FormikProps, FormikTouched} from 'formik'
import React from 'react'
import {FormSwitch} from './FormSwitch'
import Select from 'react-select'
import {IMaskInput} from 'react-imask'
import * as Yup from 'yup'
import InputMask from 'react-input-mask'
//@ts-ignore
import * as CurrencyFormat from 'react-currency-format'

type SelectType = {
  value: string
  label: string
}

export type FormInputProps = {
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined
  errors?: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined
  type?: string
  label: string
  checked?: boolean
  onCheckedChange?: (value: boolean) => void
  onDataSelectMultipleChange?: (selected: SelectType[]) => void
  placeholder?: string
  fieldProps?: FieldInputProps<any>
  className?: string
  style?: React.CSSProperties
  data?: {
    id: string | number
    name: string
  }[]
  dataSelectMultiple?: SelectType[]
  mask?: string | Function
  formik?: FormikProps<any>
  isMulti?: boolean
  onDataSelectSingleChange?: (selected: any) => void
  customElement?: React.ReactNode
}

type MaskedFormInputProps = FormInputProps & {
  value?: string
  onChange?: (value: string) => void
}

const maskedValidation = (message: string) =>
  Yup.string().test('is-valid-masked', message, (value) => !value || !value.includes('_'))
const minValueOrEmptyValidation = (minValue: number, message: string, yup: Yup.StringSchema) => {
  return yup.test('min-value', message, (value) => {
    return !value || value.length >= minValue
  })
}
export const validations = {
  masked: maskedValidation,
  cib: () =>
    minValueOrEmptyValidation(
      9,
      'Mínimo de 9 caracteres',
      maskedValidation('Insira um CIB válido').max(9, 'Máximo de 9 caracteres')
    ),
  incra: () => Yup.string().min(15, 'Mínimo de 15 caracteres').max(15, 'Máximo de 15 caracteres'),
}

export const masks = {
  phone: '(99) 99999-9999',
  cpf: '999.999.999-99',
  cnpj: '99.999.999/9999-99',
  cep: '99999-999',
  databaseName: 'aaaaaaaaaa',
  stateRegistration: '999.999.999.999',
  municipalRegistration: '999.999.999.999',
  cib: '9999999-9',
  incra: '999999.999999-9',
  year: '9999',
  car: 'aa-9999999-********************************',
  processNumber: '9999999.99.9999.9.99.9999',
  textArea: String,
  number: Number,
  money: 'money',
  area: 'area',
}

export const MaskedFieldInput = (props: MaskedFormInputProps) => {
  return <Field label={props.label} element={<MaskedInput {...props} />} />
}

export const MultipleSelectField = (props: CustomSelectProps & {label: string}) => {
  return <Field label={props.label} element={<CustomSelect {...props} />} />
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedFormInputProps>(
  (props, ref) => {
    let p = {
      placeholder: props.placeholder,
      ...props.fieldProps,

      className: clsx(
        props.className ? props.className : 'mw-300px shadow form-control',
        {
          'is-invalid': props.touched && props.errors,
        },
        {
          'is-valid': props.touched && !props.errors,
        }
      ),
      type: props.type,
    }
    if (props.onChange) {
      p = {
        ...p,
        value: props.value,
        onChange: props.onChange ? (e: any) => props?.onChange?.(e.target.value) : undefined,
      }
    }
    if (!props.mask) {
      return <input {...p} ref={ref} />
    }
    if (props.mask === masks.textArea) {
      return <textarea wrap='wrap' style={{resize: 'none'}} rows={4} {...p} ref={ref as any} />
    }
    if (props.mask === masks.money) {
      return <CurrencyFormat {...p} prefix={'R$ '} decimalSeparator={','} thousandSeparator={'.'} />
    }
    if (props.mask === masks.area) {
      return <CurrencyFormat {...p} prefix={''} decimalSeparator={','} thousandSeparator={'.'} />
    }

    return typeof props.mask === 'function' ? (
      <IMaskInput
        {...p}
        mask={props.mask as NumberConstructor}
        radix={','}
        thousandsSeparator={'.'}
        onChange={(e) => {
          p.onChange?.(e)
        }}
      />
    ) : (
      <InputMask {...p} ref={ref as any} mask={props.mask} />
    )
  }
)

export const FormInput = React.forwardRef(
  (
    {
      touched,
      errors,
      type,
      fieldProps,
      label,
      placeholder,
      className,
      data,
      dataSelectMultiple,
      checked,
      onCheckedChange,
      onDataSelectMultipleChange,
      mask,
      formik,
      isMulti,
      onDataSelectSingleChange,
      customElement,
    }: FormInputProps,
    ref
  ) => {
    let element
    if (type == 'select') {
      element = (
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
          <option value=''>Selecione</option>
          {data
            ? data.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))
            : null}
        </select>
      )
    } else if (type == 'switch') {
      element = <FormSwitch label={label} checked={checked} onCheckedChange={onCheckedChange} />
    } else if (type == 'selectMultiple') {
      const field = fieldProps
      element = (
        <CustomSelect
          onDataSelectSingleChange={onDataSelectSingleChange}
          isMulti={isMulti}
          className={className}
          dataSelectMultiple={dataSelectMultiple}
          onDataSelectMultipleChange={onDataSelectMultipleChange}
          field={field}
          formik={formik}
        />
      )
    } else if (type === 'custom') {
      return <>{customElement}</>
    } else {
      element = (
        <MaskedInput
          ref={ref as any}
          mask={mask}
          placeholder={placeholder}
          fieldProps={fieldProps}
          type={type}
          label={label}
        />
      )
    }
    return (
      <Field
        hideLabel={type === 'switch'}
        label={label}
        element={element}
        touched={touched}
        errors={errors}
      />
    )
  }
)

type CustomSelectProps = {
  name?: string
  className?: string | undefined
  dataSelectMultiple?: SelectType[] | undefined
  onDataSelectMultipleChange?: ((selected: SelectType[]) => void) | undefined
  onDataSelectSingleChange?: ((selected: any) => void) | undefined
  field?: FieldInputProps<any> | undefined
  formik?: FormikProps<any> | undefined
  isMulti?: boolean
}

function CustomSelect({
  className,
  dataSelectMultiple,
  onDataSelectMultipleChange,
  onDataSelectSingleChange,
  field,
  formik,
  isMulti,
}: CustomSelectProps): any {
  const hasChangeHandler = onDataSelectMultipleChange || onDataSelectSingleChange
  const multi = isMulti ?? true
  return (
    <Select
      className={clsx(className ? className : 'mw-300px')}
      isMulti={multi}
      options={dataSelectMultiple}
      onChange={(newValue) =>
        hasChangeHandler
          ? onDataSelectMultipleChange?.([...newValue])
          : field?.name && formik?.setFieldValue(field.name, multi ? [...newValue] : newValue)
      }
      name={field?.name}
      onBlur={field?.onBlur}
      value={field?.value}
    />
  )
}

function Field({
  hideLabel,
  label,
  element,
  touched,
  errors,
}: {
  hideLabel?: boolean
  label: string
  element: JSX.Element
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined
  errors?: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined
}): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null {
  return (
    <div className='py-3'>
      {!hideLabel && <strong className=''>{label}</strong>}
      {element}
      {touched && errors && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{errors}</span>
        </div>
      )}
    </div>
  )
}

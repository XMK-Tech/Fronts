import {FormikProps} from 'formik'
import {IMaskMixin} from 'react-imask'
import {FormInput} from './FormInput'

type Select = {
  value: string
  label: string
}

type Field = {
  type?: string
  label: string
  checked?: boolean
  onCheckedChange?: (value: boolean) => void
  onDataSelectMultipleChange?: (selected: Select[]) => void
  placeholder?: string
  inputName: string
  className?: string
  customElement?: React.ReactNode
  data?: {
    id: string | number
    name: string
  }[]
  dataSelectMultiple?: Select[]
  mask?: string | Function
  isMulti?: boolean
  onDataSelectSingleChange?: (selected: any) => void
}

export type FormColumnProps = {
  className?: string
  form?: FormikProps<any>
  inputs?: Field[]
  content?: React.ReactNode
}

export function FormColumn(props: FormColumnProps) {
  return (
    <div className={`px-4 flex-grow-1 d-flex flex-column ${props.className || ''}`}>
      {props.inputs
        ? props.inputs.map((field, index) => {
            return (
              <FormInput
                key={index}
                customElement={field.customElement}
                label={field.label}
                placeholder={field.placeholder || field.label}
                data={field.data}
                dataSelectMultiple={field.dataSelectMultiple}
                fieldProps={props.form?.getFieldProps(field.inputName)}
                touched={props.form?.touched[field.inputName]}
                errors={props.form?.errors[field.inputName]}
                type={field.type || 'text'}
                checked={field.checked}
                onCheckedChange={field.onCheckedChange}
                onDataSelectMultipleChange={field.onDataSelectMultipleChange}
                mask={field.mask}
                formik={props.form}
                isMulti={field.isMulti}
                onDataSelectSingleChange={field.onDataSelectSingleChange}
              />
            )
          })
        : null}
      {props.content}
    </div>
  )
}

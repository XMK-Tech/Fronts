import {FieldInputProps} from 'formik'
import clsx from 'clsx'

export type FormSwitchProps = {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label: string
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
}

export function FormSwitch({checked, onCheckedChange, label, justifyContent}: FormSwitchProps) {
  return (
    <div className={`d-flex flex-row justify-content-${justifyContent || 'center'} `}>
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

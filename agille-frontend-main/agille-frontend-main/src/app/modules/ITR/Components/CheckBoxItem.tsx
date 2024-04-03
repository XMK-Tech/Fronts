import React from 'react'
type CheckBoxITemProps = {
  label: string
  value?: boolean
  removeMx?: boolean
  disabled?: boolean
  defaultChecked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  fieldProps?: any
}
export default function CheckBoxITem(props: CheckBoxITemProps) {
  const hasMarginX = props.removeMx ? '' : 'mb-10 mt-10'
  return (
    <div className={hasMarginX}>
      <div className='form-check form-check-custom form-check-solid'>
        <label>
          <input
            disabled={props.disabled}
            className='form-check-input'
            type='checkbox'
            onChange={props.onChange}
            defaultChecked={props.defaultChecked}
            value={props.value?.toString()}
            id='flexCheckDefault'
            {...(props.fieldProps ?? {})}
          />
          <span className='form-check-label mw-600px'>{props.label}</span>
        </label>
      </div>
    </div>
  )
}

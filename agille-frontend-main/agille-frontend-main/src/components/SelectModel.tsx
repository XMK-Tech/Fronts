import React from 'react'

type Item = {
  name: string
  id?: string
}

type SelectModelProps = {
  label?: string
  data: Item[]
  onChange: (item: Item) => void
  hideLabel?: boolean
  value?: string
}

export default function SelectModel(props: SelectModelProps) {
  return (
    <>
      {!props.hideLabel && <strong>{props.label}</strong>}
      <select
        onChange={(e) => {
          const item = props.data.find((i) => i.id === e.target.value)
          if (!item) return
          props.onChange(item)
        }}
        value={props.value}
        className='form-select'
        aria-label='Select example'
      >
        <option>Selecione</option>
        {props.data.map((e, i) => (
          <option key={i} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
    </>
  )
}

import React from 'react'
import {Dropdown, DropdownButton} from 'react-bootstrap-v5'

export type dropItemsProps = {
  labelItem: string
  onClick: () => void
}
type DropButtonModelProps = {
  title: React.ReactNode
  dropItems: dropItemsProps[]
}

export default function DropButtonModel(props: DropButtonModelProps) {
  return (
    <DropdownButton id='dropdown-basic-button' title={props.title}>
      {props.dropItems.map((e) => (
        <Dropdown.Item onClick={e.onClick} href=''>
          {e.labelItem}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

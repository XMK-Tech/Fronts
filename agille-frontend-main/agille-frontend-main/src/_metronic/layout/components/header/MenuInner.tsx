import React from 'react'

export type MenuInnerProps = {
  items: string[]
  selectedItem: string
  onItemSelected: (item: string) => void
}

export function MenuInner(props: MenuInnerProps) {
  return (
    <ul className='nav flex-nowrap'>
      {props.items.map((i) => (
        <li key={i} className='nav-item'>
          <a
            onClick={() => props.onItemSelected(i)}
            className={`nav-link ${i === props.selectedItem ? 'active' : ''}`}
            href='#'
          >
            {i}
          </a>
        </li>
      ))}
    </ul>
  )
}

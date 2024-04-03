import React, {useEffect, useState} from 'react'
import {useDebounce, useDebouncedCallback} from 'use-debounce'
type SearchInputProps = {
  defaultValue: string
  setText: (text: string) => void
}
export const SearchInput: React.FC<SearchInputProps> = ({defaultValue, setText}) => {
  const [value, setValue] = useState(defaultValue)
  // Debounce callback
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setText(value)
    },
    // delay in ms
    1000
  )

  useEffect(() => {}, [value])
  return (
    <div>
      <input
        placeholder='Buscar'
        defaultValue={defaultValue}
        onChange={(e) => debounced(e.target.value)}
        className='form-control form-control-solid w-300px ps-14'
        data-kt-user-table-filter='search'
      />
    </div>
  )
}

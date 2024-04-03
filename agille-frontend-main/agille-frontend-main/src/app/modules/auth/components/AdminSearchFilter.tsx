import React, {useEffect, useState} from 'react'
import {Dropdown} from 'react-bootstrap-v5'
import {fakeAdm, fakeApiFilter} from '../../../services/FakeApiData'
import {SearchInput} from './SearchInput'

export type CustomSearchFilterProps = {
  options: FilterOptions[]
  onOptionSelected: (option: FilterOptions) => void
  selectedOption: FilterOptions | null
  onTextChanged: (text: string) => void
  text: string
}

export type AdminSearchFilterProps = {
  options: FilterOptions[]
  search: (items: any[]) => void
  setPage: (page: number) => void
  path: string
  type?: string
}

export type FilterOptions = {
  value: string
  label: string
  type?: 'text' | 'select'
  options?: {value: string; label: string}[]
}

export const useDebounce = (
  initialValue: string,
  delay: number = 500
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return [debouncedValue, setValue]
}

export const useFilter = (options: FilterOptions[], debounced = true) => {
  const [selectedOption, setSelectedOption] = useState<FilterOptions>(options[0])
  const [searchText, setSearchText] = useDebounce('', debounced ? 500 : 0)
  return {
    selectedOption,
    setSelectedOption,
    searchText,
    setSearchText,
    options,
    onOptionSelected: setSelectedOption,
    onTextChanged: setSearchText,
    text: searchText,
  }
}

export const CustomSearchFilter = (props: CustomSearchFilterProps) => {
  const {text, onTextChanged, selectedOption, onOptionSelected, options} = props
  const [value, setValue] = useState(props.options[0].value)
  const [show, setShow] = useState(false)
  const toggleDropdown = () => setShow(!show)
  useEffect(() => {
    if (selectedOption) {
      setValue(selectedOption.value)
      onTextChanged('')
    }
  }, [selectedOption])
  const filter = () => {
    toggleDropdown()
    const option = options.find((option) => option.value === value)
    if (!option) return
    onOptionSelected(option)
  }
  const isTextSearch = !selectedOption?.type || selectedOption?.type === 'text'
  return (
    <Dropdown show={show}>
      <div className='d-flex '>
        <div className='d-flex align-items-center position-relative my-1'>
          {isTextSearch && (
            <span className='svg-icon svg-icon-1 position-absolute ms-6'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <rect
                  opacity='0.5'
                  x='17.0365'
                  y='15.1223'
                  width='8.15546'
                  height='2'
                  rx='1'
                  transform='rotate(45 17.0365 15.1223)'
                  fill='black'
                ></rect>
                <path
                  d='M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z'
                  fill='black'
                ></path>
              </svg>
            </span>
          )}
          {isTextSearch && <SearchInput defaultValue={text} setText={onTextChanged}></SearchInput>}
          {selectedOption?.type === 'select' && (
            <SelectOptionFilter
              label={selectedOption.label}
              options={selectedOption.options ?? []}
              onValueChanged={onTextChanged}
            />
          )}

          <Dropdown.Toggle className='btn btn-sm btn-light-primary ms-3 ' onClick={toggleDropdown}>
            <span className='svg-icon svg-icon-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                  fill='black'
                ></path>
              </svg>
              <span>Filtro</span>
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu show={show} className='menu menu-sub menu-sub-dropdown w-300px w-md-325px'>
            <Dropdown.Header className='px-7 py-5'>
              <div className='fs-5 text-dark fw-bolder'>Opções De Filtro</div>
            </Dropdown.Header>

            <div className='separator border-gray-200'></div>
            <div className='px-7 py-5'>
              <div className='mb-10'>
                <select
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                  className='form-select form-select-solid fw-bolder select2-hidden-accessible'
                  aria-hidden='true'
                >
                  <option>Selecione o tipo do filtro</option>
                  {props.options.map((o, index) => (
                    <option key={index} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='d-flex justify-content-end'>
                <button onClick={filter} className='btn btn-primary fw-bold px-6'>
                  Aplicar
                </button>
              </div>
            </div>
          </Dropdown.Menu>
        </div>
      </div>
    </Dropdown>
  )
}

function SelectOptionFilter(props: {
  options: {value: string; label: string}[]
  label: string
  onValueChanged: (value: string) => void
}) {
  return (
    <div>
      <select
        className='form-select form-select-solid fw-bolder select2-hidden-accessible w-300px'
        aria-hidden='true'
        onChange={(e) => props.onValueChanged(e.target.value)}
      >
        <option value={''}>{props.label}</option>
        {props.options.map((o, index) => (
          <option key={index} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export const AdminSearchFilter: React.FC<AdminSearchFilterProps> = (props) => {
  const [value, setValue] = useState(props.options[0].value)
  const [text, setText] = useState('')
  async function filter() {
    const filtered = fakeApiFilter(props.path, value, text, props.type)
    props.setPage(1)
    props.search(filtered)
  }
  useEffect(() => {
    //  filter()
  }, [text])
  return (
    <>
      <div className='d-flex '>
        <div className='d-flex align-items-center position-relative my-1'>
          <span className='svg-icon svg-icon-1 position-absolute ms-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <rect
                opacity='0.5'
                x='17.0365'
                y='15.1223'
                width='8.15546'
                height='2'
                rx='1'
                transform='rotate(45 17.0365 15.1223)'
                fill='black'
              ></rect>
              <path
                d='M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z'
                fill='black'
              ></path>
            </svg>
          </span>
          <SearchInput defaultValue={text} setText={setText}></SearchInput>

          <button
            type='button'
            className='btn btn-sm btn-light-primary ms-3 show-menu-dropdown'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <span className='svg-icon svg-icon-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                  fill='black'
                ></path>
              </svg>
              <span>Filtro</span>
            </span>
          </button>

          <div
            className='menu menu-sub menu-sub-dropdown w-300px w-md-325px'
            data-kt-menu='true'
            data-popper-placement='bottom-end'
          >
            <div className='px-7 py-5'>
              <div className='fs-5 text-dark fw-bolder'>Opções De Filtro</div>
            </div>

            <div className='separator border-gray-200'></div>
            <div className='px-7 py-5' data-kt-user-table-filter='form'>
              <div className='mb-10'>
                <select
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                  className='form-select form-select-solid fw-bolder select2-hidden-accessible'
                  aria-hidden='true'
                >
                  <option>Selecione o tipo do filtro</option>
                  {props.options.map((o, index) => (
                    <option key={index} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='d-flex justify-content-end'>
                <button
                  onClick={filter}
                  className='btn btn-primary fw-bold px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='filter'
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
